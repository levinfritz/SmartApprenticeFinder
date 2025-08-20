import schedule
import time
import logging
from datetime import datetime, timedelta
from yousty_scraper import YoustyScraper
from typing import List, Dict
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data.database import get_session, Apprenticeship, Company, ScrapingLog

class ApprenticeshipScheduler:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('data/scraper.log'),
                logging.StreamHandler()
            ]
        )
        
    def scrape_yousty(self, limit=1000):
        """Scrape Yousty.ch for new apprenticeships"""
        started_at = datetime.now()
        scraper = YoustyScraper(delay=2)
        session = get_session()
        
        try:
            self.logger.info("Starting Yousty scraping job")
            
            # Scrape apprenticeships
            apprenticeships = scraper.search_apprenticeships(limit=limit)
            
            items_new = 0
            items_updated = 0
            
            for app_data in apprenticeships:
                try:
                    # Check if apprenticeship already exists
                    existing = session.query(Apprenticeship).filter_by(
                        source_url=app_data['source_url']
                    ).first()
                    
                    if existing:
                        # Update existing record
                        existing.title = app_data.get('title', existing.title)
                        existing.company_name = app_data.get('company_name', existing.company_name)
                        existing.location = app_data.get('location', existing.location)
                        existing.profession = app_data.get('profession', existing.profession)
                        existing.description = app_data.get('description', existing.description)
                        existing.requirements = app_data.get('requirements', existing.requirements)
                        existing.start_date = app_data.get('start_date', existing.start_date)
                        existing.updated_at = datetime.now()
                        items_updated += 1
                        
                    else:
                        # Create new record
                        new_app = Apprenticeship(
                            company_id=0,  # Will be linked later
                            title=app_data.get('title', ''),
                            profession=app_data.get('profession', ''),
                            description=app_data.get('description', ''),
                            requirements=app_data.get('requirements', ''),
                            location=app_data.get('location', ''),
                            postal_code=app_data.get('postal_code', ''),
                            start_date=app_data.get('start_date', ''),
                            application_url=app_data.get('application_url', ''),
                            source_url=app_data['source_url'],
                            source_platform=app_data['source_platform'],
                            company_name=app_data.get('company_name', ''),  # Temporary field
                            created_at=datetime.now(),
                            updated_at=datetime.now()
                        )
                        session.add(new_app)
                        items_new += 1
                        
                except Exception as e:
                    self.logger.error(f"Error processing apprenticeship {app_data.get('source_url', 'unknown')}: {e}")
                    continue
            
            # Commit changes
            session.commit()
            
            # Log scraping results
            finished_at = datetime.now()
            duration = (finished_at - started_at).total_seconds()
            
            log_entry = ScrapingLog(
                platform='yousty',
                status='success',
                items_found=len(apprenticeships),
                items_new=items_new,
                items_updated=items_updated,
                started_at=started_at,
                finished_at=finished_at,
                duration_seconds=duration
            )
            session.add(log_entry)
            session.commit()
            
            self.logger.info(f"Yousty scraping completed: {items_new} new, {items_updated} updated in {duration:.1f}s")
            
        except Exception as e:
            # Log error
            finished_at = datetime.now()
            duration = (finished_at - started_at).total_seconds()
            
            log_entry = ScrapingLog(
                platform='yousty',
                status='error',
                error_message=str(e),
                started_at=started_at,
                finished_at=finished_at,
                duration_seconds=duration
            )
            session.add(log_entry)
            session.commit()
            
            self.logger.error(f"Yousty scraping failed: {e}")
            
        finally:
            session.close()
    
    def cleanup_old_entries(self, days_old=30):
        """Remove inactive apprenticeships older than specified days"""
        session = get_session()
        try:
            cutoff_date = datetime.now() - timedelta(days=days_old)
            
            # Mark old entries as inactive
            old_entries = session.query(Apprenticeship).filter(
                Apprenticeship.updated_at < cutoff_date,
                Apprenticeship.is_active == True
            ).all()
            
            for entry in old_entries:
                entry.is_active = False
            
            session.commit()
            self.logger.info(f"Marked {len(old_entries)} old apprenticeships as inactive")
            
        except Exception as e:
            self.logger.error(f"Error during cleanup: {e}")
        finally:
            session.close()
    
    def get_stats(self):
        """Get current database statistics"""
        session = get_session()
        try:
            total_active = session.query(Apprenticeship).filter_by(is_active=True).count()
            total_inactive = session.query(Apprenticeship).filter_by(is_active=False).count()
            
            self.logger.info(f"Database stats: {total_active} active, {total_inactive} inactive apprenticeships")
            return {'active': total_active, 'inactive': total_inactive}
            
        except Exception as e:
            self.logger.error(f"Error getting stats: {e}")
            return {'active': 0, 'inactive': 0}
        finally:
            session.close()
    
    def setup_schedule(self):
        """Setup scheduled jobs"""
        # Daily scraping at 6 AM
        schedule.every().day.at("06:00").do(self.scrape_yousty, limit=2000)
        
        # Weekly cleanup on Sunday at 2 AM
        schedule.every().sunday.at("02:00").do(self.cleanup_old_entries)
        
        # Stats every 6 hours
        schedule.every(6).hours.do(self.get_stats)
        
        self.logger.info("Scheduler setup completed")
    
    def run_forever(self):
        """Run the scheduler indefinitely"""
        self.setup_schedule()
        self.logger.info("Scheduler started - running forever")
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

def main():
    """Run scheduler or specific job"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Apprenticeship Scraper Scheduler')
    parser.add_argument('--job', choices=['scrape', 'cleanup', 'stats', 'run'], 
                       default='run', help='Job to run')
    parser.add_argument('--limit', type=int, default=100, 
                       help='Limit for scraping jobs')
    
    args = parser.parse_args()
    
    scheduler = ApprenticeshipScheduler()
    
    if args.job == 'scrape':
        scheduler.scrape_yousty(limit=args.limit)
    elif args.job == 'cleanup':
        scheduler.cleanup_old_entries()
    elif args.job == 'stats':
        scheduler.get_stats()
    elif args.job == 'run':
        scheduler.run_forever()

if __name__ == "__main__":
    main()