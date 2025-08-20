import requests
import time
from typing import Tuple, Optional, Dict, List
import os
from dataclasses import dataclass
import json
import math
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class DistanceResult:
    """Result of distance calculation"""
    distance_km: float
    duration_minutes: int
    transport_mode: str
    route_found: bool
    error_message: Optional[str] = None

class DistanceCalculator:
    """Calculate distances and travel times between locations"""
    
    def __init__(self, api_key: Optional[str] = None, cache_enabled: bool = True):
        self.api_key = api_key or os.getenv('GOOGLE_MAPS_API_KEY')
        self.cache_enabled = cache_enabled
        self.cache = {}  # Simple in-memory cache
        self.base_url = "https://maps.googleapis.com/maps/api/distancematrix/json"
        
        # Fallback coordinates for major Swiss cities
        self.swiss_cities = {
            "8001": {"name": "Zürich", "lat": 47.3769, "lon": 8.5417},
            "3001": {"name": "Bern", "lat": 46.9481, "lon": 7.4474},
            "1201": {"name": "Genf", "lat": 46.2044, "lon": 6.1432},
            "4001": {"name": "Basel", "lat": 47.5596, "lon": 7.5886},
            "6001": {"name": "Luzern", "lat": 47.0502, "lon": 8.3093},
            "9001": {"name": "St. Gallen", "lat": 47.4245, "lon": 9.3767},
            "7001": {"name": "Chur", "lat": 46.8480, "lon": 9.5330},
            "6900": {"name": "Lugano", "lat": 46.0037, "lon": 8.9511}
        }
    
    def calculate_distance(self, origin_postal: str, destination_postal: str, 
                         transport_mode: str = "transit") -> DistanceResult:
        """
        Calculate distance and travel time between two postal codes
        
        Args:
            origin_postal: Origin postal code (e.g., "8001")
            destination_postal: Destination postal code (e.g., "3001")
            transport_mode: "driving", "transit", "walking", "bicycling"
        """
        
        # Check cache first
        cache_key = f"{origin_postal}_{destination_postal}_{transport_mode}"
        if self.cache_enabled and cache_key in self.cache:
            return self.cache[cache_key]
        
        try:
            # If Google Maps API is available, use it
            if self.api_key:
                result = self._calculate_with_google_maps(origin_postal, destination_postal, transport_mode)
            else:
                # Fallback to postal code distance estimation
                result = self._calculate_fallback_distance(origin_postal, destination_postal, transport_mode)
            
            # Cache the result
            if self.cache_enabled:
                self.cache[cache_key] = result
            
            return result
            
        except Exception as e:
            return DistanceResult(
                distance_km=0,
                duration_minutes=999,
                transport_mode=transport_mode,
                route_found=False,
                error_message=str(e)
            )
    
    def _calculate_with_google_maps(self, origin_postal: str, destination_postal: str, 
                                  transport_mode: str) -> DistanceResult:
        """Calculate using Google Maps Distance Matrix API"""
        
        # Convert transport mode to Google Maps format
        mode_mapping = {
            "car": "driving",
            "public": "transit", 
            "bike": "bicycling",
            "walk": "walking",
            "driving": "driving",
            "transit": "transit",
            "bicycling": "bicycling",
            "walking": "walking"
        }
        
        google_mode = mode_mapping.get(transport_mode, "transit")
        
        # Build request parameters
        params = {
            "origins": f"{origin_postal}, Switzerland",
            "destinations": f"{destination_postal}, Switzerland",
            "mode": google_mode,
            "units": "metric",
            "key": self.api_key
        }
        
        # Add transit-specific parameters
        if google_mode == "transit":
            params["transit_mode"] = "bus|train|tram"
            params["departure_time"] = "now"
        
        response = requests.get(self.base_url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if data["status"] != "OK":
            raise Exception(f"Google Maps API error: {data.get('error_message', 'Unknown error')}")
        
        # Extract distance and duration
        elements = data["rows"][0]["elements"][0]
        
        if elements["status"] != "OK":
            # Try fallback if route not found
            return self._calculate_fallback_distance(origin_postal, destination_postal, transport_mode)
        
        distance_m = elements["distance"]["value"]
        duration_s = elements["duration"]["value"]
        
        return DistanceResult(
            distance_km=distance_m / 1000,
            duration_minutes=duration_s // 60,
            transport_mode=transport_mode,
            route_found=True
        )
    
    def _calculate_fallback_distance(self, origin_postal: str, destination_postal: str, 
                                   transport_mode: str) -> DistanceResult:
        """Fallback distance calculation using postal code approximation"""
        
        # Get coordinates for postal codes
        origin_coords = self._get_postal_coordinates(origin_postal)
        dest_coords = self._get_postal_coordinates(destination_postal)
        
        if not origin_coords or not dest_coords:
            # Very rough estimation based on postal code difference
            return self._estimate_distance_by_postal_diff(origin_postal, destination_postal, transport_mode)
        
        # Calculate haversine distance
        distance_km = self._haversine_distance(
            origin_coords["lat"], origin_coords["lon"],
            dest_coords["lat"], dest_coords["lon"]
        )
        
        # Estimate travel time based on transport mode
        duration_minutes = self._estimate_travel_time(distance_km, transport_mode)
        
        return DistanceResult(
            distance_km=distance_km,
            duration_minutes=duration_minutes,
            transport_mode=transport_mode,
            route_found=True
        )
    
    def _get_postal_coordinates(self, postal_code: str) -> Optional[Dict]:
        """Get approximate coordinates for Swiss postal code"""
        
        # Check if we have exact coordinates
        if postal_code in self.swiss_cities:
            return self.swiss_cities[postal_code]
        
        # Approximate based on postal code ranges
        try:
            code = int(postal_code)
            
            # Swiss postal code regions (very rough approximation)
            if 1000 <= code <= 1999:  # Geneva area
                return {"lat": 46.2, "lon": 6.1}
            elif 2000 <= code <= 2999:  # Neuchâtel area  
                return {"lat": 47.0, "lon": 6.9}
            elif 3000 <= code <= 3999:  # Bern area
                return {"lat": 46.9, "lon": 7.4}
            elif 4000 <= code <= 4999:  # Basel area
                return {"lat": 47.6, "lon": 7.6}
            elif 5000 <= code <= 5999:  # Aargau area
                return {"lat": 47.4, "lon": 8.2}
            elif 6000 <= code <= 6999:  # Central Switzerland
                return {"lat": 47.0, "lon": 8.3}
            elif 7000 <= code <= 7999:  # Graubünden
                return {"lat": 46.8, "lon": 9.5}
            elif 8000 <= code <= 8999:  # Zürich area
                return {"lat": 47.4, "lon": 8.5}
            elif 9000 <= code <= 9999:  # Eastern Switzerland
                return {"lat": 47.4, "lon": 9.4}
            else:
                return None
                
        except ValueError:
            return None
    
    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate the great circle distance between two points in km"""
        
        # Convert decimal degrees to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Radius of earth in kilometers
        r = 6371
        
        return c * r
    
    def _estimate_travel_time(self, distance_km: float, transport_mode: str) -> int:
        """Estimate travel time based on distance and transport mode"""
        
        # Average speeds in km/h for Switzerland
        speeds = {
            "car": 60,          # Highway + city driving
            "driving": 60,
            "public": 40,       # Public transport including stops/transfers
            "transit": 40,
            "bike": 20,         # Cycling
            "bicycling": 20,
            "walk": 5,          # Walking
            "walking": 5
        }
        
        speed = speeds.get(transport_mode, 40)
        
        # Add base time for short distances (waiting, etc.)
        base_time = 10 if transport_mode in ["public", "transit"] else 5
        
        travel_time = (distance_km / speed) * 60 + base_time
        
        return max(5, int(travel_time))  # Minimum 5 minutes
    
    def _estimate_distance_by_postal_diff(self, origin: str, destination: str, 
                                        transport_mode: str) -> DistanceResult:
        """Very rough estimation based on postal code difference"""
        
        try:
            origin_code = int(origin)
            dest_code = int(destination)
            postal_diff = abs(origin_code - dest_code)
            
            # Very rough mapping of postal differences to km
            if postal_diff == 0:
                distance_km = 0
            elif postal_diff < 100:
                distance_km = 10
            elif postal_diff < 500:
                distance_km = 25
            elif postal_diff < 1000:
                distance_km = 50
            elif postal_diff < 2000:
                distance_km = 100
            else:
                distance_km = 150
                
        except ValueError:
            distance_km = 50  # Default assumption
        
        duration_minutes = self._estimate_travel_time(distance_km, transport_mode)
        
        return DistanceResult(
            distance_km=distance_km,
            duration_minutes=duration_minutes,
            transport_mode=transport_mode,
            route_found=False  # Estimated only
        )
    
    def batch_calculate_distances(self, origin_postal: str, 
                                destination_postals: List[str], 
                                transport_mode: str = "transit") -> Dict[str, DistanceResult]:
        """Calculate distances to multiple destinations efficiently"""
        
        results = {}
        
        for dest_postal in destination_postals:
            try:
                result = self.calculate_distance(origin_postal, dest_postal, transport_mode)
                results[dest_postal] = result
                
                # Small delay to avoid API rate limits
                time.sleep(0.1)
                
            except Exception as e:
                results[dest_postal] = DistanceResult(
                    distance_km=999,
                    duration_minutes=999,
                    transport_mode=transport_mode,
                    route_found=False,
                    error_message=str(e)
                )
        
        return results
    
    def is_within_commute_time(self, origin_postal: str, destination_postal: str,
                             max_minutes: int, transport_mode: str = "transit") -> bool:
        """Check if destination is within acceptable commute time"""
        
        result = self.calculate_distance(origin_postal, destination_postal, transport_mode)
        
        if not result.route_found and result.error_message:
            return False  # Conservative approach - reject if calculation failed
        
        return result.duration_minutes <= max_minutes

def test_distance_calculator():
    """Test the distance calculator"""
    
    calculator = DistanceCalculator()
    
    print("=== Testing Distance Calculator ===\n")
    
    # Test cases: major Swiss cities
    test_cases = [
        ("8001", "8002", "transit"),  # Zürich to Zürich (close)
        ("8001", "3001", "transit"),  # Zürich to Bern
        ("8001", "1201", "car"),      # Zürich to Geneva
        ("4001", "9001", "public"),   # Basel to St. Gallen
    ]
    
    for origin, dest, mode in test_cases:
        print(f"Route: {origin} -> {dest} via {mode}")
        
        result = calculator.calculate_distance(origin, dest, mode)
        
        print(f"  Distance: {result.distance_km:.1f} km")
        print(f"  Duration: {result.duration_minutes} minutes")
        print(f"  Route found: {result.route_found}")
        if result.error_message:
            print(f"  Error: {result.error_message}")
        print()
    
    # Test commute time check
    print("=== Commute Time Tests ===")
    
    commute_tests = [
        ("8001", "8002", 30, "transit"),  # Should be within 30 min
        ("8001", "1201", 60, "car"),      # Should be outside 60 min
    ]
    
    for origin, dest, max_time, mode in commute_tests:
        within_time = calculator.is_within_commute_time(origin, dest, max_time, mode)
        print(f"{origin} -> {dest} within {max_time}min by {mode}: {within_time}")

if __name__ == "__main__":
    test_distance_calculator()