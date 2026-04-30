import uuid
import json
import os
from datetime import datetime

class ZillowDataExtractor:
    def __init__(self, output_base_dir="property"):
        self.output_base_dir = output_base_dir
        
    def save_property_data_to_folder(self, property_data, folder_path):
        """Save property data as JSON to existing photo folder"""
        if not property_data:
            return None
            
        json_file = os.path.join(folder_path, "property_data.json")
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(property_data, f, indent=2, ensure_ascii=False)
            
            print(f"📄 Property data saved to: {json_file}")
            return json_file
            
        except Exception as e:
            print(f"❌ Failed to save property data: {e}")
            return None

def main():
    """Save the extracted property data to the photo folder"""
    
    # The property data extracted from browser automation
    property_data = {
        "basicInfo": {
            "address": "330 Las Colinas Blvd #924, Irving, TX 75039",
            "price": "$399,990",
            "beds": "2 beds",  # Fixed based on the listing
            "baths": "2 baths",  # Fixed based on the listing
            "sqft": "1,459 sqft",  # Fixed based on the listing
            "yearBuilt": "2001",  # Fixed based on the listing
            "hoaFee": "$1,305/mo HOA",
            "pricePerSqft": "$274/sqft",
            "propertyType": "Condominium",
            "daysOnZillow": "142 days",
            "views": "445 views",
            "saves": "9 saves"
        },
        "financial": {
            "listPrice": "$399,990",
            "zestimate": "$392,900",
            "estimatedPayment": "$3,911/mo",
            "priceCut": "$5K (1/20)"
        },
        "details": {
            "description": "ASSUMABLE MORTGAGE AT 4.125%!!! Experience luxury living in this stunning 2-bedroom condo, featuring an open floor plan on the 9th floor of the prestigious Grand Treviso. Step out onto the private balcony and enjoy panoramic views of Lake Carolyn and the vibrant Las Colinas Urban Center. Inside, you'll find beautiful hardwood-style floors, custom California Closets, and sleek granite countertops in both the kitchen and bathrooms. Plush new carpeting graces both bedrooms, ensuring comfort throughout. From the moment you enter the impeccably appointed lobby, you'll feel at home. A dedicated 24-hour concierge team welcomes residents and guests, with the management office, mail center, and ample visitor parking conveniently located just steps away. The concierge provides around-the-clock service, including package and dry-cleaning pick-up, guest check-in, and enhanced security. This condo also comes with two assigned parking spaces, numbers 345 and 346, for ultimate convenience.",
            "specialFeatures": [
                "Private balcony",
                "Open floor plan", 
                "Beautiful hardwood-style floors",
                "Custom california closets",
                "Granite countertops",
                "24-hour concierge",
                "Two assigned parking spaces"
            ]
        },
        "location": {
            "city": "Irving",
            "state": "TX", 
            "zipCode": "75039",
            "neighborhood": "Las Colinas"
        },
        "listing": {
            "listingId": "67968866",
            "mlsId": "21085103"
        },
        "photos": {
            "totalPhotos": 20
        },
        "extractionTimestamp": datetime.now().isoformat(),
        "sourceUrl": "https://www.zillow.com/homedetails/330-Las-Colinas-Blvd-924-Irving-TX-75039/67968866_zpid/"
    }
    
    # Find the most recent photo folder
    property_dir = os.path.join("property")
    if os.path.exists(property_dir):
        folders = [f for f in os.listdir(property_dir) if os.path.isdir(os.path.join(property_dir, f))]
        if folders:
            # Get the most recent folder (should be the one with photos)
            latest_folder = max(folders, key=lambda f: os.path.getctime(os.path.join(property_dir, f)))
            folder_path = os.path.join(property_dir, latest_folder)
            
            print(f"🏠 Saving property data to existing photo folder: {folder_path}")
            
            extractor = ZillowDataExtractor()
            json_file = extractor.save_property_data_to_folder(property_data, folder_path)
            
            if json_file:
                print(f"✅ Successfully saved property data!")
                print(f"📁 Folder: {folder_path}")
                print(f"📄 JSON file: {json_file}")
                
                # Show summary
                print("\n📊 PROPERTY DATA SUMMARY:")
                print(f"🏠 Address: {property_data['basicInfo']['address']}")
                print(f"💰 Price: {property_data['basicInfo']['price']}")
                print(f"🛏️  Beds: {property_data['basicInfo']['beds']}")
                print(f"🚿 Baths: {property_data['basicInfo']['baths']}")
                print(f"📐 Sqft: {property_data['basicInfo']['sqft']}")
                print(f"📅 Year Built: {property_data['basicInfo']['yearBuilt']}")
                print(f"📸 Photos: {property_data['photos']['totalPhotos']}")
                print(f"🏢 Type: {property_data['basicInfo']['propertyType']}")
                print(f"🌆 City: {property_data['location']['city']}, {property_data['location']['state']}")
                
            else:
                print("❌ Failed to save property data")
        else:
            print("❌ No photo folders found")
    else:
        print("❌ Property directory not found")

if __name__ == "__main__":
    main()
