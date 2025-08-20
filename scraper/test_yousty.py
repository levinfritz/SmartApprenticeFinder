import requests
from bs4 import BeautifulSoup
import json

def test_yousty_structure():
    """Test actual page structure to understand selectors"""
    url = "https://www.yousty.ch/de-CH/lehrstellen"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("=== PAGE TITLE ===")
        print(soup.title.get_text() if soup.title else "No title")
        
        print("\n=== LOOKING FOR JOB CARDS ===")
        # Test different selectors
        selectors = [
            '.card',
            '.job-card',
            '.apprenticeship-card',
            '[data-testid="job-card"]',
            '.lehrstelle',
            'article',
            '.position',
            '.vacancy'
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            print(f"{selector}: {len(elements)} elements found")
            if elements:
                first_element = elements[0]
                print(f"  First element classes: {first_element.get('class', [])}")
                print(f"  First element text preview: {first_element.get_text()[:100]}...")
        
        print("\n=== ALL LINKS WITH 'lehrstelle' ===")
        links = soup.find_all('a', href=True)
        lehrstelle_links = [link for link in links if 'lehrstelle' in link['href'].lower()]
        print(f"Found {len(lehrstelle_links)} links with 'lehrstelle'")
        
        for i, link in enumerate(lehrstelle_links[:5]):  # Show first 5
            print(f"  {i+1}. {link['href']} - {link.get_text()[:50]}...")
        
        print("\n=== FORM ELEMENTS ===")
        forms = soup.find_all('form')
        print(f"Found {len(forms)} forms")
        
        # Look for input fields
        inputs = soup.find_all(['input', 'select'])
        print(f"Found {len(inputs)} input/select elements")
        
        for inp in inputs[:10]:  # Show first 10
            name = inp.get('name', '')
            id_attr = inp.get('id', '')
            type_attr = inp.get('type', inp.name)
            print(f"  {type_attr}: name='{name}', id='{id_attr}'")
        
        # Save full HTML for manual inspection
        with open('data/yousty_debug.html', 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print("\nFull HTML saved to data/yousty_debug.html")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_yousty_structure()