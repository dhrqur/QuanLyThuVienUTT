function TruncatedText({ value }) {
  const text = value ?? "Chưa có";

  return (
    <span className="block truncate" title={String(text)}>
      {text}
    </span>
  );
}

export default TruncatedText;
