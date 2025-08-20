"""
Complete matching engine that combines all matching components
"""
import sys
import os
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
import json
from datetime import datetime

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from matcher.questionnaire import UserProfile, ApprenticeshipQuestionnaire
from matcher.scoring_engine import ScoringEngine, RankedApprenticeship, MatchScore
from matcher.distance_calculator import DistanceCalculator
from matcher.text_embeddings import TextEmbeddingMatcher
from matcher.ai_integration import AIIntegration, AIRecommendation
from data.database import get_session, Apprenticeship

@dataclass
class MatchingResult:
    """Complete matching result with all components"""
    ranked_apprenticeships: List[RankedApprenticeship]
    user_profile: UserProfile
    total_found: int
    processing_time: float
    ai_summary: str
    filters_applied: Dict[str, any]
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for serialization"""
        return {
            "total_found": self.total_found,
            "processing_time": self.processing_time,
            "ai_summary": self.ai_summary,
            "filters_applied": self.filters_applied,
            "top_matches": [
                {
                    "rank": app.rank,
                    "title": app.apprenticeship.title,
                    "company": app.apprenticeship.company_name,
                    "location": app.apprenticeship.location,
                    "profession": app.apprenticeship.profession,
                    "total_score": app.match_score.total_score,
                    "interest_score": app.match_score.interest_score,
                    "location_score": app.match_score.location_score,
                    "skill_score": app.match_score.skill_score,
                    "preference_score": app.match_score.preference_score,
                    "explanation": app.match_score.explanation,
                    "source_url": app.apprenticeship.source_url
                }
                for app in self.ranked_apprenticeships[:10]  # Top 10
            ]
        }

class ApprenticeshipMatchingEngine:
    """Complete matching engine that orchestrates all components"""
    
    def __init__(self, 
                 google_maps_api_key: Optional[str] = None,
                 openai_api_key: Optional[str] = None):
        
        # Initialize all components
        self.questionnaire = ApprenticeshipQuestionnaire()
        self.scoring_engine = ScoringEngine()
        self.distance_calculator = DistanceCalculator(api_key=google_maps_api_key)
        self.text_matcher = TextEmbeddingMatcher(api_key=openai_api_key)
        self.ai_integration = AIIntegration(api_key=openai_api_key)
        
    def find_matches(self, 
                    user_profile: UserProfile,
                    limit: int = 50,
                    min_score: float = 0.3,
                    apply_distance_filter: bool = True,
                    custom_filters: Optional[Dict] = None) -> MatchingResult:
        """
        Find matching apprenticeships for a user profile
        
        Args:
            user_profile: Complete user profile
            limit: Maximum number of results
            min_score: Minimum match score (0-1)
            apply_distance_filter: Whether to filter by commute time
            custom_filters: Additional database filters
        
        Returns:
            Complete matching result
        """
        
        start_time = datetime.now()
        
        # Get apprenticeships from database
        apprenticeships = self._get_filtered_apprenticeships(
            user_profile, custom_filters, apply_distance_filter
        )
        
        if not apprenticeships:
            return MatchingResult(
                ranked_apprenticeships=[],
                user_profile=user_profile,
                total_found=0,
                processing_time=0.0,
                ai_summary="Keine passenden Lehrstellen gefunden.",
                filters_applied=custom_filters or {}
            )
        
        # Score and rank apprenticeships
        ranked_apprenticeships = self.scoring_engine.rank_apprenticeships(
            user_profile, apprenticeships, limit=limit
        )
        
        # Filter by minimum score
        ranked_apprenticeships = [
            app for app in ranked_apprenticeships 
            if app.match_score.total_score >= min_score
        ]
        
        # Generate AI summary
        ai_summary = self.ai_integration.generate_top_recommendations_summary(
            ranked_apprenticeships
        )
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return MatchingResult(
            ranked_apprenticeships=ranked_apprenticeships,
            user_profile=user_profile,
            total_found=len(apprenticeships),
            processing_time=processing_time,
            ai_summary=ai_summary,
            filters_applied=custom_filters or {}
        )
    
    def get_detailed_recommendation(self, 
                                  user_profile: UserProfile,
                                  apprenticeship: Apprenticeship) -> Tuple[MatchScore, AIRecommendation]:
        """Get detailed recommendation for a specific apprenticeship"""
        
        # Calculate match score
        match_score = self.scoring_engine.score_apprenticeship(user_profile, apprenticeship)
        
        # Generate AI recommendation
        ai_recommendation = self.ai_integration.generate_match_explanation(
            user_profile, apprenticeship, match_score
        )
        
        return match_score, ai_recommendation
    
    def _get_filtered_apprenticeships(self, 
                                    user_profile: UserProfile,
                                    custom_filters: Optional[Dict],
                                    apply_distance_filter: bool) -> List[Apprenticeship]:
        """Get filtered apprenticeships from database"""
        
        session = get_session()
        
        try:
            # Base query
            query = session.query(Apprenticeship).filter_by(is_active=True)
            
            # Apply custom filters
            if custom_filters:
                for field, value in custom_filters.items():
                    if hasattr(Apprenticeship, field) and value is not None:
                        query = query.filter(getattr(Apprenticeship, field) == value)
            
            # Get initial results
            apprenticeships = query.all()
            
            # Apply distance filter if requested
            if apply_distance_filter and user_profile.max_commute_minutes:
                apprenticeships = self._filter_by_distance(
                    apprenticeships, user_profile
                )
            
            # Apply sector exclusions
            if user_profile.avoid_sectors:
                apprenticeships = self._filter_by_avoided_sectors(
                    apprenticeships, user_profile.avoid_sectors
                )
            
            return apprenticeships
            
        finally:
            session.close()
    
    def _filter_by_distance(self, 
                           apprenticeships: List[Apprenticeship],
                           user_profile: UserProfile) -> List[Apprenticeship]:
        """Filter apprenticeships by commute time"""
        
        filtered = []
        
        for app in apprenticeships:
            if not app.postal_code:
                # Keep apprenticeships without postal code (can't filter)
                filtered.append(app)
                continue
            
            # Check if within commute time
            is_within_commute = self.distance_calculator.is_within_commute_time(
                user_profile.postal_code,
                app.postal_code,
                user_profile.max_commute_minutes,
                user_profile.preferred_transport
            )
            
            if is_within_commute:
                filtered.append(app)
        
        return filtered
    
    def _filter_by_avoided_sectors(self, 
                                  apprenticeships: List[Apprenticeship],
                                  avoid_sectors: List[str]) -> List[Apprenticeship]:
        """Filter out apprenticeships in avoided sectors"""
        
        filtered = []
        
        for app in apprenticeships:
            # Use scoring engine's sector detection
            is_avoided = self.scoring_engine._is_in_avoided_sector(app, avoid_sectors)
            
            if not is_avoided:
                filtered.append(app)
        
        return filtered
    
    def get_statistics(self) -> Dict:
        """Get matching engine statistics"""
        
        session = get_session()
        
        try:
            stats = {
                "total_active_apprenticeships": session.query(Apprenticeship).filter_by(is_active=True).count(),
                "total_companies": session.query(Apprenticeship.company_name).distinct().count(),
                "profession_counts": {},
                "location_counts": {},
                "cache_stats": {
                    "distance_cache": len(self.distance_calculator.cache),
                    "embedding_cache": self.text_matcher.get_cache_stats(),
                }
            }
            
            # Simple stats for now
            stats["profession_counts"] = "Available on request"
            stats["location_counts"] = "Available on request"
            
            return stats
            
        finally:
            session.close()
    
    def benchmark_performance(self, test_profiles: List[UserProfile], iterations: int = 1) -> Dict:
        """Benchmark matching performance"""
        
        from time import time
        
        results = {
            "avg_processing_time": 0.0,
            "total_iterations": iterations * len(test_profiles),
            "avg_results_per_profile": 0.0,
            "performance_breakdown": {}
        }
        
        total_time = 0.0
        total_results = 0
        
        for i in range(iterations):
            for j, profile in enumerate(test_profiles):
                start_time = time()
                
                matching_result = self.find_matches(profile, limit=20)
                
                elapsed = time() - start_time
                total_time += elapsed
                total_results += len(matching_result.ranked_apprenticeships)
                
                print(f"Iteration {i+1}, Profile {j+1}: {elapsed:.3f}s, {len(matching_result.ranked_apprenticeships)} results")
        
        results["avg_processing_time"] = total_time / (iterations * len(test_profiles))
        results["avg_results_per_profile"] = total_results / (iterations * len(test_profiles))
        
        return results

def test_matching_engine():
    """Test the complete matching engine"""
    
    from matcher.questionnaire import create_sample_profile
    
    print("=== Testing Complete Matching Engine ===\n")
    
    # Initialize engine
    engine = ApprenticeshipMatchingEngine()
    
    # Create test profile
    user_profile = create_sample_profile()
    
    print("=== User Profile ===")
    print(f"Age: {user_profile.age}")
    print(f"Location: {user_profile.location} ({user_profile.postal_code})")
    print(f"Max Commute: {user_profile.max_commute_minutes} min by {user_profile.preferred_transport}")
    print(f"Top Interests: {sorted(user_profile.interests.items(), key=lambda x: x[1], reverse=True)[:3]}")
    print(f"Company Size Pref: {user_profile.company_size_preference}")
    print(f"Avoid Sectors: {user_profile.avoid_sectors}")
    print()
    
    # Find matches
    print("=== Finding Matches ===")
    
    matching_result = engine.find_matches(
        user_profile=user_profile,
        limit=10,
        min_score=0.4,
        apply_distance_filter=True
    )
    
    print(f"Total apprenticeships found: {matching_result.total_found}")
    print(f"Processing time: {matching_result.processing_time:.3f} seconds")
    print(f"Matches above threshold: {len(matching_result.ranked_apprenticeships)}")
    print()
    
    # Display top matches
    print("=== Top Matches ===")
    for i, ranked_app in enumerate(matching_result.ranked_apprenticeships[:5], 1):
        app = ranked_app.apprenticeship
        score = ranked_app.match_score
        
        print(f"{i}. {app.title}")
        print(f"   Company: {app.company_name}")
        print(f"   Location: {app.location}")
        print(f"   Total Score: {score.total_score:.1%}")
        print(f"   Breakdown: Interest={score.interest_score:.1%}, Location={score.location_score:.1%}, Skills={score.skill_score:.1%}, Pref={score.preference_score:.1%}")
        print(f"   Explanation: {score.explanation}")
        print()
    
    # AI Summary
    print("=== AI Summary ===")
    print(matching_result.ai_summary)
    print()
    
    # Detailed recommendation for top match
    if matching_result.ranked_apprenticeships:
        print("=== Detailed Recommendation (Top Match) ===")
        top_app = matching_result.ranked_apprenticeships[0].apprenticeship
        
        match_score, ai_recommendation = engine.get_detailed_recommendation(
            user_profile, top_app
        )
        
        print(f"Apprenticeship: {top_app.title}")
        print(f"Match Reason: {ai_recommendation.match_reason}")
        print(f"Growth Potential: {ai_recommendation.growth_potential}")
        print(f"Considerations: {ai_recommendation.considerations}")
        print("Next Steps:")
        for step in ai_recommendation.next_steps:
            print(f"  - {step}")
        print()
    
    # Statistics
    print("=== Engine Statistics ===")
    stats = engine.get_statistics()
    print(f"Total Active Apprenticeships: {stats['total_active_apprenticeships']}")
    print(f"Total Companies: {stats['total_companies']}")
    print(f"Distance Cache Size: {stats['cache_stats']['distance_cache']}")
    print(f"Embedding Cache Size: {stats['cache_stats']['embedding_cache']['cache_size']}")
    
    # JSON export
    print("=== JSON Export Sample ===")
    json_result = matching_result.to_dict()
    print(json.dumps(json_result, indent=2, ensure_ascii=False)[:500] + "...")

if __name__ == "__main__":
    test_matching_engine()