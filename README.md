# Beastlife Care AI - System Workflow Documentation

## 1. Workflow Explanation

This project simulates an AI-assisted customer support pipeline for Beastlife, from incoming customer message to routing and analytics.

## End-to-end flow

1. Message ingestio
- Customer query arrives from one of the channels: Instagram DM, WhatsApp, Email, Website Chat.
- In this prototype, a query is entered manually in the AI Analyzer page.

2. Normalization and preprocessing
- Input text is trimmed and normalized.
- The system prepares the text for category and sentiment scoring.

3. AI categorization
- A free local model logic (rule-based classifier) analyzes:
  - category
  - sentiment
  - priority
  - confidence
  - automation eligibility
  - escalation need

4. Routing decision
- If query is safe for automation, it is marked as bot-handled.
- If urgency/frustration is high, it is marked for escalation.

5. Logging and state update
- The new analysis result is added to the shared query log.
- Total query count is incremented.

6. Dashboard refresh
- KPI cards and category distribution are recalculated from live log entries.
- New analyzer outputs immediately influence dashboard metrics.

### Logical architecture (document diagram)

Customer Query
  -> AI Analyzer (input UI)
  -> Local Classifier (category + sentiment + priority + confidence)
  -> Routing Output (can_automate / escalate)
  -> Query Log State (new row appended)
  -> Dashboard Metrics Recomputed
  -> Visual Insights (KPI + Distribution + Trend)

## 2. Sample Dataset / Example Queries

### Seed dataset concept

The app starts with an initial dataset of realistic support tickets across categories:
- Order Tracking
- Delivery Delay
- Refund Request
- Product Complaint
- Subscription
- Payment Failure
- General Query

Each record contains fields such as:
- id
- text
- channel
- category
- confidence
- time
- priority
- sentiment

### Example user queries

1. Where is my order #BL9912? It has been 6 days with no update.
2. I want a full refund, this product is not what I ordered.
3. My subscription payment failed twice, please fix this urgently.
4. The creatine powder smells off. Is it expired?

### Example structured output (one record)

- category: Refund Request
- confidence: 92
- sentiment: Frustrated
- priority: Urgent
- summary: Refund request with strong dissatisfaction tone.
- suggested reply: Empathetic short response with Beastlife context.
- can_automate: false
- escalate: true
- escalation_reason: urgency or frustration detected

## 3. AI Categorization Logic

The current implementation uses a free local classifier, so no external API key is required.

### Category logic

Keyword groups are maintained for each category. The classifier:
1. converts query to lowercase
2. scores each category by keyword matches
3. selects the category with highest score
4. defaults to General Query if no strong match

### Sentiment logic

The classifier checks for:
- negative indicators (bad, upset, issue, problem, etc.)
- urgency indicators (urgent, immediately, asap, escalate, etc.)
- positive indicators (thanks, great, love, etc.)

Decision rules:
- urgency present or high negative intensity -> Frustrated
- mild negative -> Negative
- positive indicators -> Positive
- otherwise -> Neutral

### Priority logic

Rules are derived from both text and category:
- Urgent if frustration/urgency/payment/refund cues are strong
- High for delay/tracking/complaint operational issues
- Medium for subscription/refund normal flow
- Low for informational queries

### Confidence logic

A confidence score is estimated from keyword-match strength and sentiment intensity. It is bounded to a practical range (approximately 70 to 98) for realistic UI behavior.

### Automation and escalation logic

- escalate = true when urgent or frustrated
- can_automate = true when not escalated and category is safe for automation

This allows routing decisions to update dashboard and log behavior instantly.

## 4. Dashboard Mockup / Working Dashboard

This project includes a working dashboard (not static image only).

### What the dashboard currently shows

1. KPI cards
- Total Queries (30d)
- Auto-Resolved Rate
- Average Response Time (derived estimate)
- Tickets Saved / Month (derived estimate)

2. Issue distribution
- Donut chart of category share from live log entries

3. Automation potential by category
- Horizontal bar chart from category automation percentages

4. Trend chart
- Weekly trend lines for top categories
- Additional urgency signal included in heading

### Why it is a working dashboard

- Data is connected to shared app state.
- Running a new analysis adds a new log row.
- Dashboard recomputes metrics from updated data immediately.

## 5. Scaling Strategy for Higher Query Volume

To scale from prototype volume to production traffic, use this staged plan.

### A. Ingestion and queueing

- Introduce message broker (Kafka, RabbitMQ, or cloud queue).
- Decouple channel adapters from classification workers.
- Guarantee retry and dead-letter handling for failed events.

### B. Stateless AI workers

- Run classification as stateless worker services.
- Horizontal autoscaling based on queue depth and latency SLO.
- Use batching where suitable to reduce model overhead.

### C. Model serving strategy

- Keep rule-based fallback for high availability.
- Add hosted/free inference endpoint as primary model path when available.
- Enable circuit breaker and fallback-to-local path on API failure.

### D. Data storage and analytics

- Move from in-memory state to persistent storage:
  - transactional store for tickets and routing decisions
  - analytical store/warehouse for KPI trends
- Use streaming ETL for near-real-time dashboard updates.

### E. Caching and response optimization

- Cache frequent FAQ responses and semantic retrieval results.
- Cache dashboard aggregates for hot time windows.
- Precompute category-level metrics periodically.

### F. Reliability and observability

- Add tracing across ingestion -> model -> routing -> ticketing.
- Track key SLOs: p95 latency, classification error rate, escalation rate.
- Add anomaly alerts for sudden spikes by category or channel.

### G. Security and governance

- PII redaction before logging/analytics.
- Role-based access for operational dashboards.
- Prompt/model versioning and audit trail for decisions.

### H. Multi-region and failover

- Deploy workers close to channel regions.
- Use active-passive failover for core services.
- Replicate critical data with recovery objectives defined.

## 6. Current State Summary

The current implementation is a production-style prototype with:
- end-to-end workflow simulation
- no API key dependency for classification
- live dashboard updates driven by analyzer outputs
- clear path to distributed, high-volume architecture

## 7. Suggested Next Enhancements

1. Add confidence threshold slider in analyzer for what gets auto-routed.
2. Add a real queue-backed worker service and persist query log to database.
3. Add model evaluation dashboard (precision/recall by category).
4. Add role-based views: support agent, team lead, operations manager.

## 8. Alternative Implementation: Vector DB + Python Backend

An alternative and more production-oriented implementation can use:
- Python backend for inference and routing
- embedding generation for each incoming query
- vector database retrieval for semantic context
- hybrid decisioning (AI output + deterministic business rules)

This approach is documented in detail in:
- VECTOR_DB_PYTHON_APPROACH.md

Use that document for full architecture, processing flow, data model, scalability, and migration plan.

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
