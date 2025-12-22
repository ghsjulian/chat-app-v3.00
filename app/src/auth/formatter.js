const timeAgo = (dateInput)=>{
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date; // difference in milliseconds
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  // Format long dates
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}

export default timeAgo
/*
// Example usage:
console.log(timeAgo(Date.now() - 30 * 1000));        // Just now
console.log(timeAgo(Date.now() - 5 * 60 * 60 * 1000)); // 5 hours ago
console.log(timeAgo(Date.now() - 24 * 60 * 60 * 1000)); // Yesterday
console.log(timeAgo(Date.now() - 3 * 24 * 60 * 60 * 1000)); // 3 days ago
console.log(timeAgo("2025-01-20")); // 20 January 2025-01-20
*/ 