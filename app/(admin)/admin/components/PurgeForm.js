"use client";

export default function PurgeForm({ fileName }) {
  const handleSubmit = (event) => {
    const ok = window.confirm("Delete permanently? This cannot be undone.");
    if (!ok) {
      event.preventDefault();
    }
  };

  return (
    <form className="inline-form" action="/api/quotations" method="post" onSubmit={handleSubmit}>
      <input type="hidden" name="action" value="purge" />
      <input type="hidden" name="fileName" value={fileName} />
      <button className="action-delete" type="submit">
        Delete permanently
      </button>
    </form>
  );
}
