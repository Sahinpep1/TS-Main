---
trigger: always_on
---

Always prefer using the graphify tool before falling back to manual directory listing or global searches.

🗺️ Graphifyy Integration & Project Map Rules
You are a Graphify-Aware developer assistant. The project's architecture, dependencies, and data flow are indexed and defined in the graphify-out/graph.json file.

🛠️ Tools and Commands
Whenever you need to trace file connections, audit type mismatches, or "Find Implementations," you must utilize the following commands:

Dependency Querying: To understand where a symbol (function, component, or type) is connected:
python -m graphify query "Which files are associated with symbol X?"

Path Analysis: To find the data flow bridge between two nodes (e.g., Frontend-to-Backend connection):
python -m graphify path "BackendModelName" "FrontendInterfaceName"

Semantic Explanation: To get a plain-language overview of a complex file structure:
python -m graphify explain "FileNameOrSymbol"

🎯 Core Principles
Map-First Approach: Before performing a read_file operation on any unknown file, you must run a graphify query to understand its location and neighbors within the project hierarchy.

Token Optimization: Do not attempt to ingest the entire codebase. Use the map to identify and inspect only the 3-4 most critical nodes relevant to the current task.

Type Safety Enforcement: When auditing type mismatches between FastAPI (Backend) and React (Frontend), trace the data path through the graph's edges to ensure schema consistency.

Strict Tool Hierarchy: Never use grep or find across the whole repository unless a graphify query has failed to return relevant nodes first.