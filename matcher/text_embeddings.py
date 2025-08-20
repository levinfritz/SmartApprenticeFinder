import openai
import numpy as np
from typing import List, Dict, Tuple, Optional
import json
import os
from dataclasses import dataclass
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@dataclass
class EmbeddingMatch:
    """Result of text similarity matching"""
    similarity_score: float  # 0-1 cosine similarity
    matched_text: str
    explanation: str

class TextEmbeddingMatcher:
    """Handle text embeddings for semantic matching"""
    
    def __init__(self, api_key: Optional[str] = None, cache_enabled: bool = True):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        self.cache_enabled = cache_enabled
        self.embedding_cache = {}
        self.cache_file = "data/embeddings_cache.pkl"
        
        # Load cache from disk
        self._load_cache()
        
        # Initialize OpenAI client
        if self.api_key:
            openai.api_key = self.api_key
        
        # Swiss profession keywords for semantic matching
        self.profession_keywords = {
            "informatik": ["programmieren", "software", "computer", "digital", "IT", "system", "daten", "code"],
            "gesundheit": ["medizin", "pflege", "therapie", "patient", "krankenhaus", "spital", "behandlung"],
            "verkauf": ["kunde", "beratung", "verkaufen", "service", "laden", "geschäft", "kasse"],
            "handwerk": ["bauen", "reparieren", "werkzeug", "material", "montage", "installation"],
            "gastronomie": ["kochen", "restaurant", "küche", "gäste", "service", "essen", "zubereitung"],
            "verwaltung": ["büro", "organisation", "dokumente", "verwaltung", "buchführung", "administration"],
            "kreativ": ["design", "gestaltung", "kunst", "kreativ", "farben", "formen", "ästhetik"],
            "technik": ["maschinen", "mechanik", "elektrik", "engineering", "technisch", "wartung"],
            "natur": ["umwelt", "natur", "garten", "landwirtschaft", "outdoor", "tiere", "pflanzen"],
            "transport": ["fahren", "logistik", "transport", "lieferung", "verkehr", "güter"]
        }
    
    def get_embedding(self, text: str, model: str = "text-embedding-ada-002") -> np.ndarray:
        """Get embedding vector for text"""
        
        # Check cache first
        cache_key = f"{text}_{model}"
        if self.cache_enabled and cache_key in self.embedding_cache:
            return self.embedding_cache[cache_key]
        
        try:
            if self.api_key:
                # Use OpenAI API
                response = openai.Embedding.create(
                    input=text,
                    model=model
                )
                embedding = np.array(response['data'][0]['embedding'])
            else:
                # Fallback to keyword-based embedding
                embedding = self._create_keyword_embedding(text)
            
            # Cache the result
            if self.cache_enabled:
                self.embedding_cache[cache_key] = embedding
                self._save_cache()
            
            return embedding
            
        except Exception as e:
            print(f"Error getting embedding: {e}")
            # Return keyword-based fallback
            return self._create_keyword_embedding(text)
    
    def _create_keyword_embedding(self, text: str) -> np.ndarray:
        """Create simple keyword-based embedding as fallback"""
        
        text_lower = text.lower()
        
        # Create feature vector based on profession keywords
        embedding = np.zeros(len(self.profession_keywords))
        
        for i, (category, keywords) in enumerate(self.profession_keywords.items()):
            # Count keyword matches
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            # Normalize by number of keywords in category
            embedding[i] = matches / len(keywords)
        
        # Add some noise to avoid identical embeddings
        noise = np.random.normal(0, 0.01, len(embedding))
        embedding += noise
        
        # Normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        
        return embedding
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate cosine similarity between two texts"""
        
        embedding1 = self.get_embedding(text1)
        embedding2 = self.get_embedding(text2)
        
        # Calculate cosine similarity
        similarity = cosine_similarity([embedding1], [embedding2])[0][0]
        
        # Ensure similarity is between 0 and 1
        return max(0, min(1, (similarity + 1) / 2))
    
    def find_best_matches(self, query_text: str, candidate_texts: List[str], 
                         top_k: int = 5) -> List[EmbeddingMatch]:
        """Find best matching texts from candidates"""
        
        if not candidate_texts:
            return []
        
        query_embedding = self.get_embedding(query_text)
        matches = []
        
        for candidate in candidate_texts:
            candidate_embedding = self.get_embedding(candidate)
            
            # Calculate similarity
            similarity = cosine_similarity([query_embedding], [candidate_embedding])[0][0]
            # Normalize to 0-1 range
            similarity = max(0, min(1, (similarity + 1) / 2))
            
            explanation = self._explain_match(query_text, candidate, similarity)
            
            matches.append(EmbeddingMatch(
                similarity_score=similarity,
                matched_text=candidate,
                explanation=explanation
            ))
        
        # Sort by similarity score
        matches.sort(key=lambda x: x.similarity_score, reverse=True)
        
        return matches[:top_k]
    
    def _explain_match(self, query: str, candidate: str, similarity: float) -> str:
        """Generate explanation for match"""
        
        if similarity > 0.8:
            return f"Sehr ähnlich zu '{query}' - hohe Übereinstimmung"
        elif similarity > 0.6:
            return f"Gut passend zu '{query}' - gute Übereinstimmung"
        elif similarity > 0.4:
            return f"Teilweise passend zu '{query}' - moderate Übereinstimmung"
        else:
            return f"Wenig passend zu '{query}' - geringe Übereinstimmung"
    
    def match_interests_to_professions(self, user_interests: List[str], 
                                     available_professions: List[str]) -> Dict[str, EmbeddingMatch]:
        """Match user interest descriptions to available professions"""
        
        results = {}
        
        for interest in user_interests:
            matches = self.find_best_matches(interest, available_professions, top_k=3)
            if matches:
                results[interest] = matches[0]  # Best match
        
        return results
    
    def enhance_profession_description(self, profession: str, description: str) -> str:
        """Create enhanced description for better matching"""
        
        # Combine profession title and description
        combined_text = f"{profession}. {description}"
        
        # Add relevant keywords based on profession type
        profession_lower = profession.lower()
        additional_keywords = []
        
        for category, keywords in self.profession_keywords.items():
            if any(keyword in profession_lower for keyword in keywords):
                additional_keywords.extend(keywords[:3])  # Add top 3 keywords
        
        if additional_keywords:
            combined_text += f" Relevante Bereiche: {', '.join(additional_keywords)}"
        
        return combined_text
    
    def batch_similarity_matrix(self, texts: List[str]) -> np.ndarray:
        """Create similarity matrix for multiple texts"""
        
        embeddings = []
        for text in texts:
            embedding = self.get_embedding(text)
            embeddings.append(embedding)
        
        embeddings_matrix = np.array(embeddings)
        
        # Calculate cosine similarity matrix
        similarity_matrix = cosine_similarity(embeddings_matrix)
        
        # Normalize to 0-1 range
        similarity_matrix = (similarity_matrix + 1) / 2
        
        return similarity_matrix
    
    def _load_cache(self):
        """Load embedding cache from disk"""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'rb') as f:
                    self.embedding_cache = pickle.load(f)
        except Exception as e:
            print(f"Could not load embedding cache: {e}")
            self.embedding_cache = {}
    
    def _save_cache(self):
        """Save embedding cache to disk"""
        try:
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            with open(self.cache_file, 'wb') as f:
                pickle.dump(self.embedding_cache, f)
        except Exception as e:
            print(f"Could not save embedding cache: {e}")
    
    def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        return {
            "cache_size": len(self.embedding_cache),
            "cache_enabled": self.cache_enabled,
            "api_key_available": bool(self.api_key)
        }

def test_text_embeddings():
    """Test the text embedding matcher"""
    
    matcher = TextEmbeddingMatcher()
    
    print("=== Testing Text Embeddings ===\n")
    
    # Test basic similarity
    test_pairs = [
        ("Ich interessiere mich für Computer und Programmieren", "Informatiker/in EFZ"),
        ("Ich helfe gerne Menschen und arbeite im Gesundheitswesen", "Fachmann/-frau Gesundheit EFZ"),
        ("Ich verkaufe gerne und berate Kunden", "Detailhandelsfachmann/-frau EFZ"),
        ("Ich baue und repariere gerne Sachen", "Polymechaniker/in EFZ")
    ]
    
    print("=== Similarity Tests ===")
    for interest, profession in test_pairs:
        similarity = matcher.calculate_similarity(interest, profession)
        print(f"Interest: {interest}")
        print(f"Profession: {profession}")
        print(f"Similarity: {similarity:.3f}")
        print()
    
    # Test profession matching
    print("=== Profession Matching ===")
    
    user_interests = [
        "Ich arbeite gerne mit Computern",
        "Ich helfe gerne kranken Menschen",
        "Ich verkaufe gerne Produkte"
    ]
    
    available_professions = [
        "Informatiker/in EFZ",
        "Kaufmann/-frau EFZ",
        "Fachmann/-frau Gesundheit EFZ",
        "Koch/Köchin EFZ",
        "Polymechaniker/in EFZ"
    ]
    
    matches = matcher.match_interests_to_professions(user_interests, available_professions)
    
    for interest, match in matches.items():
        print(f"Interest: {interest}")
        print(f"Best match: {match.matched_text}")
        print(f"Score: {match.similarity_score:.3f}")
        print(f"Explanation: {match.explanation}")
        print()
    
    # Cache stats
    print("=== Cache Statistics ===")
    stats = matcher.get_cache_stats()
    for key, value in stats.items():
        print(f"{key}: {value}")

if __name__ == "__main__":
    test_text_embeddings()