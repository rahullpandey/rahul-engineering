"use client";

export default function RecycleForm({ fileName }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const row = form.closest("tr");
    if (row) {
      row.classList.add("row-removing");
    }
    setTimeout(() => {
      form.submit();
    }, 260);
  };

  return (
    <form className="inline-form" action="/api/quotations" method="post" onSubmit={handleSubmit}>
      <input type="hidden" name="action" value="delete" />
      <input type="hidden" name="fileName" value={fileName} />
      <button className="action-icon-btn" type="submit" aria-label="Move to recycle">
        <span className="recycle-icon" aria-hidden />
      </button>
    </form>
  );
}
