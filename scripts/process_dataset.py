#!/usr/bin/env python3
"""
Gmail Event Extractor Dataset Processor
========================================

Script to process and analyze the exported dataset for ML training.
Usage: python process_dataset.py [dataset_file.json]
"""

import json
import pandas as pd
import argparse
from datetime import datetime
from collections import Counter
import re

class DatasetProcessor:
    def __init__(self, dataset_file):
        self.dataset_file = dataset_file
        self.data = None
        self.df = None
        
    def load_dataset(self):
        """Load the JSON dataset file"""
        try:
            with open(self.dataset_file, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            print(f"✅ Dataset loaded: {self.data.get('metadata', {}).get('totalEntries', 0)} entries")
            return True
        except Exception as e:
            print(f"❌ Error loading dataset: {e}")
            return False
    
    def to_dataframe(self):
        """Convert to pandas DataFrame for analysis"""
        if not self.data:
            return None
            
        entries = self.data.get('entries', [])
        
        # Flatten the data for pandas
        flattened = []
        for entry in entries:
            for event in entry.get('events', []) or [{}]:  # Handle empty events for rejected
                row = {
                    'email_subject': entry.get('emailSubject', ''),
                    'email_body': entry.get('emailBody', ''),
                    'email_sender': entry.get('emailSender', ''),
                    'email_date': entry.get('emailDate', ''),
                    'action': entry.get('action', ''),
                    'timestamp': entry.get('timestamp', ''),
                    'event_title': event.get('title', ''),
                    'event_description': event.get('description', ''),
                    'event_start_datetime': event.get('startDateTime', ''),  # Now ISO string
                    'event_end_datetime': event.get('endDateTime', ''),      # Now ISO string
                    'event_location': event.get('location', ''),
                    'has_event': len(entry.get('events', [])) > 0
                }
                flattened.append(row)
        
        self.df = pd.DataFrame(flattened)
        
        # Convert datetime strings to pandas datetime for analysis
        if 'event_start_datetime' in self.df.columns:
            self.df['event_start_datetime'] = pd.to_datetime(self.df['event_start_datetime'], errors='coerce')
            self.df['event_end_datetime'] = pd.to_datetime(self.df['event_end_datetime'], errors='coerce')
        
        return self.df
    
    def analyze_dataset(self):
        """Analyze the dataset and show statistics"""
        if self.df is None:
            self.to_dataframe()
            
        print("\n📊 Dataset Analysis")
        print("=" * 50)
        
        # Basic stats
        total_interactions = len(self.df)
        approved = self.df[self.df['action'] == 'approved'].shape[0]
        rejected = self.df[self.df['action'] == 'rejected'].shape[0]
        
        print(f"Total interactions: {total_interactions}")
        print(f"Approved events: {approved} ({approved/total_interactions*100:.1f}%)")
        print(f"Rejected events: {rejected} ({rejected/total_interactions*100:.1f}%)")
        
        # Email analysis
        print(f"\nUnique senders: {self.df['email_sender'].nunique()}")
        print(f"Average email body length: {self.df['email_body'].str.len().mean():.0f} chars")
        
        # Event patterns
        if approved > 0:
            approved_df = self.df[self.df['action'] == 'approved']
            print(f"Average event title length: {approved_df['event_title'].str.len().mean():.0f} chars")
            
            # Time patterns from datetime objects
            start_times = approved_df['event_start_datetime'].dropna()
            if len(start_times) > 0:
                hours = [dt.hour for dt in start_times if pd.notna(dt)]
                if hours:
                    common_hours = Counter(hours).most_common(3)
                    print(f"Most common event hours: {common_hours}")
        
        return {
            'total_interactions': total_interactions,
            'approved': approved,
            'rejected': rejected,
            'approval_rate': approved / total_interactions if total_interactions > 0 else 0
        }
    
    def extract_features(self):
        """Extract features for ML training"""
        if self.df is None:
            self.to_dataframe()
            
        print("\n🔧 Extracting ML Features")
        print("=" * 50)
        
        # Text features
        self.df['email_body_length'] = self.df['email_body'].str.len()
        self.df['email_subject_length'] = self.df['email_subject'].str.len()
        self.df['has_time_keywords'] = self.df['email_body'].str.contains(
            r'\b(בשעה|ב-|מ-|עד|ביום|תאריך|זמן|פגישה|ישיבה|אירוע)\b', 
            case=False, regex=True, na=False
        )
        self.df['has_date_pattern'] = self.df['email_body'].str.contains(
            r'\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)',
            case=False, regex=True, na=False
        )
        
        # Email domain features
        self.df['sender_domain'] = self.df['email_sender'].str.extract(r'@([^>]+)>')
        
        feature_cols = [
            'email_body_length', 'email_subject_length', 
            'has_time_keywords', 'has_date_pattern', 'action'
        ]
        
        features_df = self.df[feature_cols].copy()
        features_df['label'] = (self.df['action'] == 'approved').astype(int)
        
        return features_df
    
    def export_for_training(self, output_file=None):
        """Export processed data for ML training"""
        features_df = self.extract_features()
        
        if output_file is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"training_data_{timestamp}.csv"
        
        features_df.to_csv(output_file, index=False, encoding='utf-8')
        print(f"💾 Training data exported to: {output_file}")
        
        return output_file
    
    def show_sample_data(self, n=5):
        """Show sample approved and rejected examples"""
        if self.df is None:
            self.to_dataframe()
            
        print(f"\n📋 Sample Data (showing {n} examples)")
        print("=" * 50)
        
        approved = self.df[self.df['action'] == 'approved'].head(n)
        rejected = self.df[self.df['action'] == 'rejected'].head(n)
        
        print("\n✅ APPROVED Examples:")
        for idx, row in approved.iterrows():
            print(f"Subject: {row['email_subject'][:60]}...")
            print(f"Event: {row['event_title']}")
            print(f"Body snippet: {row['email_body'][:100]}...")
            print("-" * 30)
        
        print("\n❌ REJECTED Examples:")
        for idx, row in rejected.iterrows():
            print(f"Subject: {row['email_subject'][:60]}...")
            print(f"Body snippet: {row['email_body'][:100]}...")
            print("-" * 30)

def main():
    parser = argparse.ArgumentParser(description='Process Gmail Event Extractor dataset')
    parser.add_argument('dataset_file', help='Path to the JSON dataset file')
    parser.add_argument('--export', '-e', action='store_true', help='Export for ML training')
    parser.add_argument('--sample', '-s', type=int, default=3, help='Number of sample examples to show')
    
    args = parser.parse_args()
    
    processor = DatasetProcessor(args.dataset_file)
    
    if not processor.load_dataset():
        return 1
    
    # Analyze the dataset
    stats = processor.analyze_dataset()
    
    # Show samples
    processor.show_sample_data(args.sample)
    
    # Export for training if requested
    if args.export:
        output_file = processor.export_for_training()
        print(f"\n🚀 Ready for ML training! Use: {output_file}")
    
    return 0

if __name__ == "__main__":
    exit(main())
