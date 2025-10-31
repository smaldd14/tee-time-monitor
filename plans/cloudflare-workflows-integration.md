# Cloudflare Workflows Integration Plan

## Architecture Plan

### **Workflow Purpose**
Use a Cloudflare Workflow to orchestrate the multi-step monitor creation process with automatic retries and durability for:
1. Saving search criteria to PostgreSQL
2. Saving priority courses to PostgreSQL
3. Saving user search preferences to PostgreSQL
4. Creating Stripe checkout session
5. Returning checkout URL to client

### **Why Workflows?**
- **Durability**: If any step fails (DB connection issues, Stripe API timeout), the workflow automatically retries
- **State Persistence**: Each step's output is persisted, so if a failure occurs midway, we don't re-execute completed steps
- **Reliability**: Critical for payment flows where we can't lose user data or double-charge

### **Implementation Structure**

```
src/worker/
├── workflows/
│   └── CreateMonitorWorkflow.ts    # Workflow definition
├── services/
│   └── monitorService.ts           # Existing DB service (reuse)
├── routes/
│   └── tee-time.ts                 # Trigger workflow from API
```

### **Workflow Steps**

**Step 1: Geocode ZIP Code**
- Convert ZIP to lat/long
- Retry on API failures
- Store coordinates in workflow state

**Step 2: Insert Search Criteria**
- Connect to PostgreSQL
- Upsert search_criteria table
- Return `searchCriteriaId`
- Auto-retry on DB connection failures

**Step 3: Insert Priority Courses** (if provided)
- Upsert priority_courses table
- Use `searchCriteriaId` from Step 2
- Skip if no priority courses

**Step 4: Insert User Search Preference**
- Upsert user_search_preferences table
- Return `userSearchPreferenceId`
- This ID goes into Stripe metadata

**Step 5: Create Stripe Checkout Session**
- Call Stripe API with metadata containing:
  - `userSearchPreferenceId`
  - `email`
- Return checkout session URL
- Stripe webhook will use this ID to trigger Spring Boot schedule

### **Configuration Changes**

**wrangler.json:**
```json
{
  "workflows": [
    {
      "name": "create-monitor-workflow",
      "binding": "CREATE_MONITOR_WORKFLOW",
      "class_name": "CreateMonitorWorkflow"
    }
  ]
}
```

**worker-configuration.d.ts:**
```typescript
interface Env {
  DATABASE_URL: string;
  LGG_API_URL: string;
  CREATE_MONITOR_WORKFLOW: Workflow;
  // Later: STRIPE_SECRET_KEY
}
```

### **API Flow**

**POST /monitor/create:**
1. Validate request body
2. Trigger workflow: `env.CREATE_MONITOR_WORKFLOW.create({ params: body })`
3. Return workflow instance ID immediately
4. Client can poll workflow status or wait for completion

### **Error Handling**

- Each step wrapped in `step.do()` with automatic retries
- Failed steps retry with exponential backoff
- DB connection errors don't lose progress
- If Stripe fails, previous DB inserts already persisted
- Workflow can be monitored via Cloudflare dashboard

### **Benefits Over Direct API Calls**

1. **No duplicate DB entries**: If API request times out but DB wrote succeeded, retrying won't duplicate data due to `ON CONFLICT` clauses
2. **Partial completion recovery**: If Stripe fails after DB writes, workflow retries Stripe without re-doing DB operations
3. **Observability**: View workflow execution in Cloudflare dashboard
4. **Scalability**: Workflows handle load better than long-running Worker requests

### **Future: Stripe Webhook Integration**

When Stripe payment completes:
1. Webhook receives `userSearchPreferenceId` from metadata
2. Calls Spring Boot API to start Temporal schedule
3. Spring Boot updates `schedule_id` in `user_search_preferences` table

## Next Steps

1. Update wrangler.json with workflow configuration
2. Create CreateMonitorWorkflow class
3. Update worker-configuration.d.ts with workflow binding
4. Update /monitor/create endpoint to trigger workflow
5. Add Stripe integration
6. Implement webhook handler
