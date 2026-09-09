# Cách cài bộ AGENTS rules

## Cách nhanh nhất

Copy **toàn bộ nội dung của thư mục này vào root của repository**.

Sau khi copy, cấu trúc phải là:

```text
<your-repo>/
├─ AGENTS.md
└─ docs/
   └─ agent/
      ├─ 00-core-contract.md
      ├─ 01-clarification-planning.md
      ├─ 02-clean-code-architecture.md
      ├─ 03-safety-runtime-data.md
      ├─ 04-phase-workflow.md
      ├─ 05-testing-verification.md
      ├─ 06-skills-tools.md
      ├─ MANIFEST.md
      └─ ORIGINAL_FULL.md
```

Không cần sửa đường dẫn nếu giữ đúng cấu trúc trên.

## Cách hoạt động

- `AGENTS.md` ở root là file bootstrap/router ngắn, dùng để áp các luật quan trọng nhất và quyết định file rule nào cần đọc.
- Các file `docs/agent/*.md` chứa **nguyên văn các section từ bản gốc**, chia theo chủ đề.
- Agent được yêu cầu **không đọc tất cả file rule cùng lúc**, chỉ đọc nhóm liên quan tới task.
- `ORIGINAL_FULL.md` là bản backup nguyên gốc, không dùng trong công việc bình thường.
- `MANIFEST.md` cho biết chính xác section 1–146 đã được chuyển sang file nào.

## Ví dụ

### Sửa UI nhỏ
Agent thường cần:
- `AGENTS.md`
- `01-clarification-planning.md` nếu requirement chưa rõ
- `02-clean-code-architecture.md`
- `05-testing-verification.md`
- `04-phase-workflow.md` nếu task không trivial

### Fix bug authentication
Agent thường cần:
- `AGENTS.md`
- `01-clarification-planning.md`
- `03-safety-runtime-data.md`
- `04-phase-workflow.md`
- `05-testing-verification.md`
- `06-skills-tools.md` nếu có skill phù hợp

### Chỉ sửa typo/comment rất nhỏ
Agent thường chỉ cần `AGENTS.md`; bootstrap contract đã có rule cho trivial changes.

## Lưu ý

Không xóa `MANIFEST.md` hoặc `ORIGINAL_FULL.md` nếu bạn muốn giữ khả năng audit rằng không có rule nào bị thất thoát. Hai file này không được yêu cầu đọc trong normal workflow nên không tạo overhead context thường xuyên.
