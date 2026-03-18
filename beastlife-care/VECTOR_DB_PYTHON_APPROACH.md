# Beastlife Care AI - Vector DB and Python Approach

## 1. Why This Alternative Approach

The current app uses a local rule-based classifier in the frontend.
A stronger production alternative is:
- Python backend service for AI pipeline
- Vector database for semantic understanding
- Retrieval + classification + routing in one server workflow

This approach improves:
- accuracy on messy customer language
- resilience for unseen query patterns
- scalability under high query volume
- maintainability of business logic

## 2. High-Level Architecture

Client (React UI)
  -> API Gateway
  -> Python Inference Service (FastAPI)
  -> Embedding Model
  -> Vector DB (Pinecone, Weaviate, Qdrant, Milvus, pgvector)
  -> LLM / Classification Layer
  -> Routing Engine
  -> Ticketing/CRM + Analytics Store

## 3. Core Idea: Convert Query to Vectors

A customer message is transformed into an embedding vector.
That vector represents semantic meaning, not just exact keywords.

Example flow:
1. Query text comes in.
2. Python service computes embedding vector.
3. Service performs nearest-neighbor search in vector DB.
4. Retrieved similar examples and policy snippets are used as context.
5. Final classifier decides category, sentiment, priority, automation, escalation.

This handles paraphrases better than pure keyword rules.

## 4. Detailed Processing Pipeline

### Step 1. Ingestion

- Receive query with metadata:
  - channel
  - customer id
  - timestamp
  - optional language

### Step 2. Cleaning and normalization

- Lowercasing where suitable
- Unicode cleanup
- spelling normalization for common slang
- language detection if multilingual traffic exists

### Step 3. Embedding generation

- Use an embedding model in Python.
- Output vector dimension depends on model choice.

### Step 4. Vector retrieval

- Search top-k nearest support examples from vector DB.
- Search top-k relevant policy chunks from knowledge base.

### Step 5. Structured classification

- Build structured prompt or model input with:
  - original query
  - retrieved examples
  - policy constraints
- Predict:
  - category
  - confidence
  - sentiment
  - priority
  - can_automate
  - escalate
  - escalation_reason

### Step 6. Routing decision

- Rule engine uses model outputs + business constraints.
- Example hard rules:
  - refund amount threshold always escalates
  - legal or safety keywords always escalate
  - low confidence requires human review

### Step 7. Logging and analytics

- Store full structured result in DB.
- Emit event for dashboard pipeline.
- Keep audit metadata: model version, embedding version, policy version.

## 5. Data Model Suggestion

### SupportQuery table

- query_id
- message_text
- channel
- customer_id
- created_at

### QueryAnalysis table

- query_id
- category
- confidence
- sentiment
- priority
- can_automate
- escalate
- escalation_reason
- model_version
- embedding_version
- latency_ms

### RetrievedContext table

- query_id
- source_type (faq, policy, historic_ticket)
- source_id
- similarity_score

## 6. Python Stack Recommendation

### API layer

- FastAPI
- Uvicorn / Gunicorn

### ML and retrieval

- sentence-transformers or hosted embedding API
- numpy, pandas
- faiss (local) or managed vector DB SDK
- optional langchain for orchestration

### Storage and async

- PostgreSQL
- Redis for caching
- Celery / RQ / Dramatiq for background workers

### Monitoring

- Prometheus + Grafana
- OpenTelemetry traces
- structured logs with request ids

## 7. Example Pseudocode

This is conceptual flow, not production code.

1. receive query
2. embed query
3. retrieve similar vectors
4. classify with retrieved context
5. apply business rules
6. save result
7. return structured response to frontend

## 8. How This Improves Categorization Quality

Compared to keyword rules:
- catches semantically similar phrases
- handles typo-heavy and informal text
- improves confidence calibration using contextual retrieval
- reduces false routing for edge cases

Example:
- "My parcel is still floating somewhere, no update for days"
can map to Delivery Delay / Order Tracking even without exact keywords.

## 9. Scalability Design for High Volume

### Horizontal scaling

- Stateless Python workers behind load balancer
- Autoscale by queue depth and p95 latency

### Vector DB scaling

- Partition by tenant, language, or region
- Use approximate nearest neighbor indexes
- Periodic index compaction and rebuild strategy

### Throughput optimization

- Batch embedding requests when possible
- Cache frequent FAQ retrievals
- Separate online inference from heavy offline re-indexing

### Reliability

- Retry with backoff for embedding/vector calls
- Circuit breaker to fallback classifier when vector store is degraded
- Dead-letter queue for unprocessed events

## 10. Migration Path from Current Prototype

1. Keep frontend UI unchanged.
2. Move analyzer logic from browser to Python API endpoint.
3. Start with category and sentiment only.
4. Add vector retrieval for FAQ and policy context.
5. Enable advanced routing and confidence thresholds.
6. Integrate persistent query log and live dashboard metrics from backend.

## 11. Risks and Mitigations

### Risk: embedding drift

- Mitigation: versioned embeddings and scheduled re-indexing.

### Risk: retrieval noise

- Mitigation: reranking layer and similarity threshold cutoffs.

### Risk: latency spikes

- Mitigation: caching, async pipeline, and fallback model path.

### Risk: inconsistent decisions

- Mitigation: hybrid approach with deterministic business rules after model output.

## 12. Recommended Hybrid Strategy

Best production setup is hybrid:
- Vector retrieval for semantic context
- ML model for classification
- Deterministic business rules for compliance and routing guarantees

This gives both intelligence and control.
