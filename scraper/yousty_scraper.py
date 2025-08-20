import requests
from bs4 import BeautifulSoup
import time
import json
from datetime import datetime, timedelta
import re
from urllib.parse import urljoin, urlparse
import logging
from typing import List, Dict, Optional

class YoustyScraper:
    def __init__(self, delay=1, max_retries=3):
        self.base_url = "https://www.yousty.ch"
        self.delay = delay
        self.max_retries = max_retries
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def search_apprenticeships(self, location="", profession="", limit=100) -> List[Dict]:
        """
        Search for apprenticeships on Yousty.ch
        
        Args:
            location: Location filter (e.g. "Zürich", "Bern")
            profession: Profession filter (e.g. "Informatiker", "Kaufmann")
            limit: Maximum number of results to return
            
        Returns:
            List of apprenticeship dictionaries
        """
        apprenticeships = []
        page = 1
        
        while len(apprenticeships) < limit:
            try:
                # Build search URL
                search_url = self._build_search_url(location, profession, page)
                self.logger.info(f"Scraping page {page}: {search_url}")
                
                # Get search results page
                soup = self._get_page(search_url)
                if not soup:
                    break
                
                # Extract apprenticeship links from search results
                job_links = self._extract_job_links(soup)
                
                if not job_links:
                    self.logger.info("No more job links found")
                    break
                
                # Scrape individual job details
                for link in job_links:
                    if len(apprenticeships) >= limit:
                        break
                        
                    job_data = self._scrape_job_details(link)
                    if job_data:
                        apprenticeships.append(job_data)
                        self.logger.info(f"Scraped: {job_data.get('title', 'Unknown')} at {job_data.get('company_name', 'Unknown')}")
                    
                    time.sleep(self.delay)
                
                page += 1
                time.sleep(self.delay)
                
            except Exception as e:
                self.logger.error(f"Error scraping page {page}: {str(e)}")
                break
        
        self.logger.info(f"Total apprenticeships scraped: {len(apprenticeships)}")
        return apprenticeships

    def _build_search_url(self, location, profession, page) -> str:
        """Build search URL with filters"""
        base_search = f"{self.base_url}/de-CH/lehrstellen"
        params = []
        
        if location:
            params.append(f"place={location}")
        if profession:
            params.append(f"profession={profession}")
        if page > 1:
            params.append(f"page={page}")
            
        if params:
            return f"{base_search}?{'&'.join(params)}"
        return base_search

    def _get_page(self, url: str) -> Optional[BeautifulSoup]:
        """Get and parse a web page"""
        for attempt in range(self.max_retries):
            try:
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                return BeautifulSoup(response.content, 'html.parser')
            except Exception as e:
                self.logger.warning(f"Attempt {attempt + 1} failed for {url}: {str(e)}")
                if attempt < self.max_retries - 1:
                    time.sleep(2 ** attempt)
        return None

    def _extract_job_links(self, soup: BeautifulSoup) -> List[str]:
        """Extract job detail page links from search results"""
        links = []
        
        # Look for result containers based on actual HTML structure
        result_containers = soup.select('.result .result-container')
        
        for container in result_containers:
            # Find links to job profiles
            link_elements = container.select('a[href*="/lehrstellen/profile/"]')
            for element in link_elements:
                href = element.get('href')
                if href and '/profile/' in href:
                    full_url = urljoin(self.base_url, href)
                    if full_url not in links:
                        links.append(full_url)
                        break  # Only take first link per container
        
        return links

    def _scrape_job_details(self, url: str) -> Optional[Dict]:
        """Scrape detailed information from a job page"""
        soup = self._get_page(url)
        if not soup:
            return None
            
        try:
            job_data = {
                'source_url': url,
                'source_platform': 'yousty',
                'scraped_at': datetime.now().isoformat()
            }
            
            # Extract job title
            title_selectors = ['h1', '.job-title', '.apprenticeship-title', '[data-testid="job-title"]']
            job_data['title'] = self._extract_text_by_selectors(soup, title_selectors)
            
            # Extract company name
            company_selectors = ['.company-name', '.employer-name', '[data-testid="company-name"]', 'h2']
            job_data['company_name'] = self._extract_text_by_selectors(soup, company_selectors)
            
            # Extract location
            location_selectors = ['.location', '.job-location', '[data-testid="location"]']
            location_text = self._extract_text_by_selectors(soup, location_selectors)
            job_data['location'] = location_text
            job_data['postal_code'] = self._extract_postal_code(location_text)
            
            # Extract profession/field
            profession_selectors = ['.profession', '.job-category', '.field']
            job_data['profession'] = self._extract_text_by_selectors(soup, profession_selectors)
            
            # Extract description
            desc_selectors = ['.job-description', '.description', '.content', '.details']
            job_data['description'] = self._extract_text_by_selectors(soup, desc_selectors, is_long_text=True)
            
            # Extract requirements
            req_selectors = ['.requirements', '.job-requirements', '.qualifications']
            job_data['requirements'] = self._extract_text_by_selectors(soup, req_selectors, is_long_text=True)
            
            # Extract start date
            date_selectors = ['.start-date', '.job-start', '[data-testid="start-date"]']
            job_data['start_date'] = self._extract_text_by_selectors(soup, date_selectors)
            
            # Extract application URL
            app_selectors = ['a[href*="apply"]', '.apply-button', '.application-link']
            app_link = soup.select_one(' '.join(app_selectors))
            if app_link:
                job_data['application_url'] = urljoin(url, app_link.get('href', ''))
            
            # Clean and validate data
            job_data = self._clean_job_data(job_data)
            
            return job_data
            
        except Exception as e:
            self.logger.error(f"Error scraping job details from {url}: {str(e)}")
            return None

    def _extract_text_by_selectors(self, soup: BeautifulSoup, selectors: List[str], is_long_text=False) -> str:
        """Extract text using multiple selectors as fallback"""
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(strip=True)
                if text:
                    if is_long_text:
                        return text[:2000]  # Limit length for long texts
                    return text[:500]  # Limit length for regular fields
        return ""

    def _extract_postal_code(self, location_text: str) -> str:
        """Extract postal code from location text"""
        if not location_text:
            return ""
        
        # Swiss postal codes are 4 digits
        match = re.search(r'\b(\d{4})\b', location_text)
        return match.group(1) if match else ""

    def _clean_job_data(self, job_data: Dict) -> Dict:
        """Clean and validate job data"""
        # Remove empty strings and None values
        cleaned = {k: v for k, v in job_data.items() if v}
        
        # Ensure required fields have defaults
        required_fields = {
            'title': 'Lehrstelle',
            'company_name': 'Unbekanntes Unternehmen',
            'location': 'Schweiz',
            'profession': 'Diverse'
        }
        
        for field, default in required_fields.items():
            if not cleaned.get(field):
                cleaned[field] = default
                
        return cleaned

    def save_to_json(self, apprenticeships: List[Dict], filename: str):
        """Save apprenticeships data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(apprenticeships, f, ensure_ascii=False, indent=2)
        self.logger.info(f"Saved {len(apprenticeships)} apprenticeships to {filename}")

def main():
    """Test the scraper"""
    scraper = YoustyScraper(delay=2)
    
    # Test with a small sample
    apprenticeships = scraper.search_apprenticeships(
        location="Zürich", 
        profession="", 
        limit=10
    )
    
    if apprenticeships:
        scraper.save_to_json(apprenticeships, "data/yousty_sample.json")
        print(f"Scraped {len(apprenticeships)} apprenticeships")
        
        # Print first result as example
        if apprenticeships:
            print("\nExample result:")
            print(json.dumps(apprenticeships[0], indent=2, ensure_ascii=False))
    else:
        print("No apprenticeships found")

if __name__ == "__main__":
    main()