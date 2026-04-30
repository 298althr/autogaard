import uuid
import requests
import os
import time
import re
import json
from urllib.parse import urlparse
from datetime import datetime

class ZillowDataScraperV2:
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
    
    def extract_property_data_from_html(self, property_url, zpid):
        """Extract property data by fetching HTML and parsing"""
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.zillow.com/',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
        
        try:
            print(f"📡 Fetching property page HTML...")
            response = requests.get(property_url, headers=headers, timeout=30)
            response.raise_for_status()
            
            html_content = response.text
            print(f"✅ Successfully fetched HTML content ({len(html_content)} characters)")
            
            # Initialize property data structure
            property_data = {
                'basicInfo': {
                    'address': None,
                    'price': None,
                    'beds': None,
                    'baths': None,
                    'sqft': None,
                    'yearBuilt': None,
                    'hoaFee': None,
                    'pricePerSqft': None,
                    'propertyType': None,
                    'daysOnZillow': None,
                    'views': None,
                    'saves': None
                },
                'financial': {
                    'listPrice': None,
                    'zestimate': None,
                    'estimatedPayment': None,
                    'priceCut': None
                },
                'details': {
                    'description': None,
                    'specialFeatures': []
                },
                'location': {
                    'city': None,
                    'state': None,
                    'zipCode': None
                },
                'listing': {
                    'listingId': None,
                    'mlsId': None
                },
                'photos': {
                    'totalPhotos': None
                },
                'extractionTimestamp': datetime.now().isoformat(),
                'sourceUrl': property_url
            }
            
            # Extract address from title or h1
            address_patterns = [
                r'<h1[^>]*>([^<]+)</h1>',
                r'<title[^>]*>([^<]+)</title>',
                r'"address":"([^"]+)"',
                r'"streetAddress":"([^"]+)"'
            ]
            
            for pattern in address_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    if 'zillow' not in match.lower() and len(match) > 10:
                        clean_address = re.sub(r'<[^>]+>', '', match).strip()
                        if ',' in clean_address and any(char.isdigit() for char in clean_address):
                            property_data['basicInfo']['address'] = clean_address
                            break
                if property_data['basicInfo']['address']:
                    break
            
            # Extract price
            price_patterns = [
                r'"price":(\d+)',
                r'"listPrice":(\d+)',
                r'\$(\d{3},\d{3})',
                r'"price":{"value":(\d+)',
                r'"price":\{"value":(\d+)'
            ]
            
            for pattern in price_patterns:
                matches = re.findall(pattern, html_content)
                for match in matches:
                    price_value = match.replace(',', '')
                    if price_value.isdigit() and int(price_value) > 10000:
                        property_data['basicInfo']['price'] = f"${int(price_value):,}"
                        property_data['financial']['listPrice'] = f"${int(price_value):,}"
                        break
                if property_data['basicInfo']['price']:
                    break
            
            # Extract bedrooms
            bed_patterns = [
                r'"bedrooms":(\d+)',
                r'"numBeds":(\d+)',
                r'"bedroomCount":(\d+)',
                r'(\d+)\s*beds?',
                r'"beds":(\d+)'
            ]
            
            for pattern in bed_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    if match.isdigit() and 0 < int(match) < 20:
                        property_data['basicInfo']['beds'] = f"{match} beds"
                        break
                if property_data['basicInfo']['beds']:
                    break
            
            # Extract bathrooms
            bath_patterns = [
                r'"bathrooms":([\d.]+)',
                r'"numBaths":([\d.]+)',
                r'"bathroomCount":([\d.]+)',
                r'(\d+(?:\.\d+)?)\s*baths?',
                r'"baths":([\d.]+)'
            ]
            
            for pattern in bath_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    try:
                        bath_value = float(match)
                        if 0 < bath_value < 20:
                            property_data['basicInfo']['baths'] = f"{bath_value} baths"
                            break
                    except ValueError:
                        continue
                if property_data['basicInfo']['baths']:
                    break
            
            # Extract square footage
            sqft_patterns = [
                r'"livingArea":(\d+)',
                r'"area":(\d+)',
                r'"sqft":(\d+)',
                r'(\d{3,4})\s*sqft',
                r'"size":(\d+)'
            ]
            
            for pattern in sqft_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    if match.isdigit() and 100 < int(match) < 10000:
                        property_data['basicInfo']['sqft'] = f"{int(match):,} sqft"
                        break
                if property_data['basicInfo']['sqft']:
                    break
            
            # Extract year built
            year_patterns = [
                r'"yearBuilt":(\d{4})',
                r'"built":(\d{4})',
                r'built in (\d{4})',
                r'"constructionYear":(\d{4})'
            ]
            
            for pattern in year_patterns:
                matches = re.findall(pattern, html_content)
                for match in matches:
                    if 1900 < int(match) <= datetime.now().year:
                        property_data['basicInfo']['yearBuilt'] = match
                        break
                if property_data['basicInfo']['yearBuilt']:
                    break
            
            # Extract property type
            type_patterns = [
                r'"propertyType":"([^"]+)"',
                r'"homeType":"([^"]+)"',
                r'"type":"([^"]+)"',
                r'Condominium|Single Family|Multi Family|Townhouse|Apartment'
            ]
            
            for pattern in type_patterns:
                if 'Condominium' in pattern or 'Single Family' in pattern:
                    matches = re.findall(pattern, html_content, re.IGNORECASE)
                    for match in matches:
                        if match and len(match) > 3:
                            property_data['basicInfo']['propertyType'] = match.strip()
                            break
                else:
                    matches = re.findall(pattern, html_content, re.IGNORECASE)
                    for match in matches:
                        if match and len(match) > 3 and 'zillow' not in match.lower():
                            property_data['basicInfo']['propertyType'] = match.strip('"')
                            break
                if property_data['basicInfo']['propertyType']:
                    break
            
            # Extract description
            desc_patterns = [
                r'"description":"([^"]{100,})"',
                r'"summary":"([^"]{100,})"',
                r'"remarks":"([^"]{100,})"',
                r'<meta[^>]*name="description"[^>]*content="([^"]{100,})"'
            ]
            
            for pattern in desc_patterns:
                matches = re.findall(pattern, html_content, re.DOTALL | re.IGNORECASE)
                for match in matches:
                    clean_desc = re.sub(r'\\n', ' ', match).strip()
                    if len(clean_desc) > 50 and 'zillow' not in clean_desc.lower():
                        property_data['details']['description'] = clean_desc[:500] + "..." if len(clean_desc) > 500 else clean_desc
                        break
                if property_data['details']['description']:
                    break
            
            # Extract Zestimate
            zestimate_patterns = [
                r'"zestimate":(\d+)',
                r'"zestimateAmount":(\d+)',
                r'"zestimate":{"value":(\d+)}'
            ]
            
            for pattern in zestimate_patterns:
                matches = re.findall(pattern, html_content)
                for match in matches:
                    if match.isdigit() and int(match) > 10000:
                        property_data['financial']['zestimate'] = f"${int(match):,}"
                        break
                if property_data['financial']['zestimate']:
                    break
            
            # Extract photo count
            photo_patterns = [
                r'"photoCount":(\d+)',
                r'"imageCount":(\d+)',
                r'"totalImages":(\d+)',
                r'(\d+)\s*photos'
            ]
            
            for pattern in photo_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    if match.isdigit() and 0 < int(match) < 100:
                        property_data['photos']['totalPhotos'] = int(match)
                        break
                if property_data['photos']['totalPhotos']:
                    break
            
            # Extract ZPID from URL
            zpid_match = re.search(r'(\d+)_zpid', property_url)
            if zpid_match:
                property_data['listing']['listingId'] = zpid_match.group(1)
            
            # Extract MLS ID
            mls_patterns = [
                r'"mlsId":"([^"]+)"',
                r'"listingId":"([^"]+)"',
                r'MLS[_%20]+(\d+)',
                r'"mlsNumber":"([^"]+)"'
            ]
            
            for pattern in mls_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    if match and match.isdigit():
                        property_data['listing']['mlsId'] = match
                        break
                if property_data['listing']['mlsId']:
                    break
            
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
            
            return property_data
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error fetching property page: {e}")
            return None
        except Exception as e:
            print(f"❌ Error extracting property data: {e}")
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
        
        # Extract property data from HTML
        property_data = self.extract_property_data_from_html(property_url, zpid)
        
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
    
    scraper = ZillowDataScraperV2()
    
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
