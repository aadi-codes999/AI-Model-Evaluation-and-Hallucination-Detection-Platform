
"""
Evidence retrieval for Evalora.

Retrieves relevant passages from trusted reference context for a claim.
Uses TF-IDF and cosine similarity, keeping the implementation lightweight.

Note:
Similarity measures relevance, not whether a claim is actually true.
"""

from dataclasses import dataclass, asdict
from typing import Any
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@dataclass
class EvidenceResult:
    claim: str
    evidence: list[str]
    similarity_scores: list[float]
    found: bool

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-serializable result."""
        return asdict(self)


def _clean_text(text: str) -> str:
    """Normalize whitespace without changing the original meaning."""
    return re.sub(r"\s+", " ", text).strip()


def split_into_passages(
    reference_context: str,
    max_passage_chars: int = 500,
) -> list[str]:
    """
    Split reference context into manageable passages.

    Paragraphs are preferred. Long paragraphs are split into smaller
    chunks to avoid treating an entire document as one passage.
    """
    if not isinstance(reference_context, str):
        raise TypeError("reference_context must be a string.")

    if max_passage_chars < 1:
        raise ValueError("max_passage_chars must be positive.")

    text = reference_context.strip()
    if not text:
        return []

    paragraphs = [
        _clean_text(p)
        for p in re.split(r"\n\s*\n", text)
        if _clean_text(p)
    ]

    passages: list[str] = []

    for paragraph in paragraphs:
        if len(paragraph) <= max_passage_chars:
            passages.append(paragraph)
            continue

        # Split long paragraphs into sentence-based chunks.
        sentences = re.split(r"(?<=[.!?])\s+", paragraph)
        chunk = ""

        for sentence in sentences:
            # A single very long sentence may need hard splitting.
            if len(sentence) > max_passage_chars:
                if chunk:
                    passages.append(chunk)
                    chunk = ""

                for start in range(0, len(sentence), max_passage_chars):
                    passages.append(
                        sentence[start : start + max_passage_chars].strip()
                    )
                continue

            candidate = f"{chunk} {sentence}".strip()

            if len(candidate) > max_passage_chars and chunk:
                passages.append(chunk)
                chunk = sentence
            else:
                chunk = candidate

        if chunk:
            passages.append(chunk)

    return passages


def retrieve_evidence(
    claim: str,
    reference_context: str,
    top_k: int = 3,
    min_similarity: float = 0.05,
    max_passage_chars: int = 500,
) -> EvidenceResult:
    """
    Retrieve the top relevant passages for a claim.

    Args:
        claim: A factual statement to investigate.
        reference_context: Trusted source text supplied for evaluation.
        top_k: Maximum number of evidence passages to return.
        min_similarity: Minimum cosine similarity required for a match.
        max_passage_chars: Maximum preferred passage length.

    Returns:
        EvidenceResult containing the claim, passages, similarity scores,
        and whether any relevant passage was found.
    """
    if not isinstance(claim, str):
        raise TypeError("claim must be a string.")

    if not isinstance(reference_context, str):
        raise TypeError("reference_context must be a string.")

    if top_k < 1:
        raise ValueError("top_k must be at least 1.")

    if not 0 <= min_similarity <= 1:
        raise ValueError("min_similarity must be between 0 and 1.")

    normalized_claim = _clean_text(claim)

    if not normalized_claim or not reference_context.strip():
        return EvidenceResult(
            claim=claim,
            evidence=[],
            similarity_scores=[],
            found=False,
        )

    passages = split_into_passages(
        reference_context,
        max_passage_chars=max_passage_chars,
    )

    if not passages:
        return EvidenceResult(
            claim=claim,
            evidence=[],
            similarity_scores=[],
            found=False,
        )

    # Fit on the claim and passages so unseen claim terms are represented.
    vectorizer = TfidfVectorizer(
        lowercase=True,
        strip_accents="unicode",
        ngram_range=(1, 2),
        sublinear_tf=True,
    )

    try:
        vectors = vectorizer.fit_transform([normalized_claim, *passages])
    except ValueError:
        # For example, all text may consist only of stop words.
        return EvidenceResult(
            claim=claim,
            evidence=[],
            similarity_scores=[],
            found=False,
        )

    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    ranked_indices = sorted(
        range(len(passages)),
        key=lambda index: float(scores[index]),
        reverse=True,
    )

    selected_evidence: list[str] = []
    selected_scores: list[float] = []

    for index in ranked_indices:
        score = float(scores[index])

        if score < min_similarity:
            break

        selected_evidence.append(passages[index])
        selected_scores.append(round(score, 4))

        if len(selected_evidence) >= top_k:
            break

    return EvidenceResult(
        claim=claim,
        evidence=selected_evidence,
        similarity_scores=selected_scores,
        found=bool(selected_evidence),
    )


def retrieve_evidence_batch(
    claims: list[str],
    reference_context: str,
    top_k: int = 3,
    min_similarity: float = 0.05,
) -> list[EvidenceResult]:
    """Retrieve evidence for multiple claims."""
    return [
        retrieve_evidence(
            claim=claim,
            reference_context=reference_context,
            top_k=top_k,
            min_similarity=min_similarity,
        )
        for claim in claims
    ]
