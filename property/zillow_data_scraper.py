import uuid
import requests
import os
import time
import re
import json
from urllib.parse import urlparse
from datetime import datetime

class ZillowDataScraper:
    def __init__(self, output_base_dir="property"):
        self.output_base_dir = output_base_dir
        
    def generate_unique_id(self):
        """Generate a unique ID for the property folder"""
        return str(uuid.uuid4())[:8]
    
    def create_output_folder(self, unique_id, zpid):
        """Create output folder with unique ID"""
        folder_name = f"{unique_id}_zpid_{zpid}"
        output_folder = os.path.join(self.output_base_dir, folder_name)
        os.makedirs(output_folder, exist_ok=True)
        return output_folder
    
    def extract_property_data_browser(self, property_url, zpid):
        """Extract property data using browser automation"""
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    viewport={'width': 1920, 'height': 1080}
                )
                page = context.new_page()
                
                # Navigate to property page
                page.goto(property_url)
                page.wait_for_timeout(3000)
                
                # Extract comprehensive property data
                property_data = {
                    basicInfo: {
                        address: None,
                        price: None,
                        beds: None,
                        baths: None,
                        sqft: None,
                        yearBuilt: None,
                        hoaFee: None,
                        pricePerSqft: None,
                        propertyType: None,
                        daysOnZillow: None,
                        views: None,
                        saves: None
                    },
                    financial: {
                        listPrice: None,
                        zestimate: None,
                        estimatedPayment: None,
                        priceCut: None
                    },
                    details: {
                        description: None,
                        specialFeatures: []
                    },
                    location: {
                        city: None,
                        state: None,
                        zipCode: None
                    },
                    listing: {
                        listingId: None,
                        mlsId: None
                    },
                    photos: {
                        totalPhotos: None
                    },
                    extractionTimestamp: datetime.now().isoformat(),
                    sourceUrl: property_url
                }
                
                # Extract address from h1
                try:
                    address_element = page.query_selector('h1')
                    if address_element:
                        property_data['basicInfo']['address'] = address_element.text_content()
                except:
                    pass
                
                # Extract price - look for dollar amount patterns
                try:
                    price_elements = page.query_selector_all('span')
                    for element in price_elements:
                        text = element.text_content()
                        if text and '$' in text and ',' in text and len(text) > 6:
                            price_match = re.search(r'\$[\d,]+', text)
                            if price_match and int(re.sub(r'[^0-9]', '', text)) > 10000:
                                property_data['basicInfo']['price'] = price_match.group(0)
                                property_data['financial']['listPrice'] = price_match.group(0)
                                break
                except:
                    pass
                
                # Extract beds, baths, sqft from the summary section
                try:
                    summary_elements = page.query_selector_all('span')
                    for element in summary_elements:
                        text = element.text_content()
                        
                        # Look for beds
                        if text and re.match(r'^\d+\s*beds?$', text, re.IGNORECASE):
                            property_data['basicInfo']['beds'] = text
                        # Look for baths
                        elif text and re.match(r'^\d+\s*baths?$', text, re.IGNORECASE):
                            property_data['basicInfo']['baths'] = text
                        # Look for sqft
                        elif text and re.match(r'^\d[\d,]*\s*sqft$', text, re.IGNORECASE):
                            property_data['basicInfo']['sqft'] = text
                except:
                    pass
                
                # Extract "at a glance" facts
                try:
                    list_elements = page.query_selector_all('li')
                    for element in list_elements:
                        text = element.text_content()
                        
                        if 'Condominium' in text or 'Single Family' in text or 'Multi Family' in text:
                            property_data['basicInfo']['propertyType'] = text.strip()
                        elif 'Built in' in text:
                            property_data['basicInfo']['yearBuilt'] = text.replace('Built in', '').strip()
                        elif 'sqft lot' in text:
                            property_data['basicInfo']['lotSize'] = text.strip()
                        elif 'Zestimate' in text:
                            property_data['financial']['zestimate'] = text.replace('Zestimate®', '').strip()
                        elif '/sqft' in text:
                            property_data['basicInfo']['pricePerSqft'] = text.strip()
                        elif 'HOA' in text:
                            property_data['basicInfo']['hoaFee'] = text.strip()
                except:
                    pass
                
                # Extract estimated payment
                try:
                    payment_elements = page.query_selector_all('span')
                    for element in payment_elements:
                        text = element.text_content()
                        if text and '/mo' in text:
                            property_data['financial']['estimatedPayment'] = text
                            break
                except:
                    pass
                
                # Extract description
                try:
                    article_elements = page.query_selector_all('article')
                    for element in article_elements:
                        text = element.text_content()
                        if text and len(text) > 100 and 'days' not in text and 'views' not in text:
                            property_data['details']['description'] = text.strip()
                            break
                except:
                    pass
                
                # Extract special features
                try:
                    list_elements = page.query_selector_all('li')
                    for element in list_elements:
                        text = element.text_content()
                        if text and any(keyword in text.lower() for keyword in ['balcony', 'floor', 'closets', 'granite']):
                            property_data['details']['specialFeatures'].append(text.strip())
                except:
                    pass
                
                # Extract stats (days on Zillow, views, saves)
                try:
                    strong_elements = page.query_selector_all('strong')
                    for element in strong_elements:
                        text = element.text_content()
                        if text and re.match(r'^\d+$', text):
                            if not property_data['basicInfo']['daysOnZillow']:
                                property_data['basicInfo']['daysOnZillow'] = text + ' days'
                            elif not property_data['basicInfo']['views']:
                                property_data['basicInfo']['views'] = text + ' views'
                            elif not property_data['basicInfo']['saves']:
                                property_data['basicInfo']['saves'] = text + ' saves'
                except:
                    pass
                
                # Extract price cut
                try:
                    all_elements = page.query_selector_all('span')
                    for element in all_elements:
                        text = element.text_content()
                        if text and 'Price cut' in text:
                            property_data['financial']['priceCut'] = text
                            break
                except:
                    pass
                
                # Extract photo count
                try:
                    button_elements = page.query_selector_all('button')
                    for element in button_elements:
                        text = element.text_content()
                        if text and 'photos' in text:
                            match = re.search(r'(\d+)', text)
                            if match:
                                property_data['photos']['totalPhotos'] = int(match.group(1))
                            break
                except:
                    pass
                
                # Extract ZPID from URL
                try:
                    zpid_match = re.search(r'(\d+)_zpid', property_url)
                    if zpid_match:
                        property_data['listing']['listingId'] = zpid_match.group(1)
                except:
                    pass
                
                # Extract MLS ID from page title
                try:
                    title = page.title()
                    mls_match = re.search(r'MLS[_%20]+(\d+)', title, re.IGNORECASE)
                    if mls_match:
                        property_data['listing']['mlsId'] = mls_match.group(1)
                except:
                    pass
                
                # Parse address components
                if property_data['basicInfo']['address']:
                    address_parts = property_data['basicInfo']['address'].split(',')
                    if len(address_parts) >= 3:
                        property_data['location']['city'] = address_parts[1].strip()
                        state_zip = address_parts[2].strip()
                        if state_zip:
                            state_zip_parts = state_zip.split(' ')
                            property_data['location']['state'] = state_zip_parts[0]
                            property_data['location']['zipCode'] = ' '.join(state_zip_parts[1:])
                
                browser.close()
                return property_data
                
        except ImportError:
            print("❌ Playwright not installed for data extraction")
            return None
        except Exception as e:
            print(f"❌ Browser data extraction failed: {e}")
            return None
    
    def save_property_data_json(self, property_data, output_folder):
        """Save property data as JSON file"""
        if not property_data:
            return None
            
        json_file = os.path.join(output_folder, "property_data.json")
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(property_data, f, indent=2, ensure_ascii=False)
            
            print(f"📄 Property data saved to: {json_file}")
            return json_file
            
        except Exception as e:
            print(f"❌ Failed to save property data: {e}")
            return None
    
    def scrape_property_data(self, property_url, zpid):
        """Complete property data scraping workflow"""
        print(f"🏠 Starting Zillow property data scraper for ZPID: {zpid}")
        print(f"🌐 Property URL: {property_url}")
        print("=" * 60)
        
        # Generate unique ID and create folder
        unique_id = self.generate_unique_id()
        output_folder = self.create_output_folder(unique_id, zpid)
        print(f"📁 Output folder: {output_folder}")
        print(f"🆔 Unique ID: {unique_id}")
        
        # Extract property data using browser automation
        print(f"🔍 Extracting property data from page...")
        property_data = self.extract_property_data_browser(property_url, zpid)
        
        if property_data:
            print(f"✅ Property data extracted successfully")
            
            # Save property data as JSON
            json_file = self.save_property_data_json(property_data, output_folder)
            
            # Generate summary
            summary = {
                'unique_id': unique_id,
                'zpid': zpid,
                'property_url': property_url,
                'output_folder': output_folder,
                'data_extraction_successful': True,
                'json_file': json_file,
                'extraction_timestamp': datetime.now().isoformat()
            }
            
            print("=" * 60)
            print("📊 PROPERTY DATA EXTRACTION SUMMARY")
            print("=" * 60)
            print(f"🆔 Unique ID: {summary['unique_id']}")
            print(f"🏠 Address: {property_data.get('basicInfo', {}).get('address', 'N/A')}")
            print(f"💰 Price: {property_data.get('basicInfo', {}).get('price', 'N/A')}")
            print(f"🛏️  Beds: {property_data.get('basicInfo', {}).get('beds', 'N/A')}")
            print(f"🚿 Baths: {property_data.get('basicInfo', {}).get('baths', 'N/A')}")
            print(f"📐 Sqft: {property_data.get('basicInfo', {}).get('sqft', 'N/A')}")
            print(f"📅 Year Built: {property_data.get('basicInfo', {}).get('yearBuilt', 'N/A')}")
            print(f"📸 Total Photos: {property_data.get('photos', {}).get('totalPhotos', 'N/A')}")
            print(f"📄 Data saved to: {json_file}")
            print("=" * 60)
            
            return summary
        else:
            print("❌ Failed to extract property data")
            return {
                'unique_id': unique_id,
                'zpid': zpid,
                'property_url': property_url,
                'output_folder': output_folder,
                'data_extraction_successful': False,
                'error': 'Failed to extract property data',
                'extraction_timestamp': datetime.now().isoformat()
            }

def main():
    """Test the property data scraper"""
    
    scraper = ZillowDataScraper()
    
    # Test with the last listing
    property_url = "https://www.zillow.com/homedetails/330-Las-Colinas-Blvd-924-Irving-TX-75039/67968866_zpid/"
    zpid = "67968866"
    
    results = scraper.scrape_property_data(property_url, zpid)
    
    if results.get('data_extraction_successful'):
        print(f"\n🎉 Property data scraping completed!")
        print(f"📄 Data saved to: {results.get('json_file')}")
    else:
        print(f"\n❌ Property data scraping failed!")

if __name__ == "__main__":
    main()
