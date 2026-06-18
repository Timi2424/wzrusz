# Plan: testing-inquiry-persistence-and-auth

## Progress

### Phase 1: Inquiry persistence tests
#### Automated
- [x] 1.1 create saves multiple line items with sortOrder in transaction
- [x] 1.2 create rejects unknown decorationId
- [x] 1.3 getDetail returns line items sorted by sortOrder
- [x] 1.4 getDetail throws when inquiry missing

### Phase 2: Admin auth guard tests
#### Automated
- [x] 2.1 AdminAuthGuard rejects missing user (401)
- [x] 2.2 AdminAuthGuard rejects non-admin role (403)
- [x] 2.3 AdminAuthGuard accepts admin user
- [x] 2.4 `nx test api` green

### Phase 3: Docs
#### Automated
- [x] 3.1 test-plan Phase 2 complete + §6.5 cookbook
