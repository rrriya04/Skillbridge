/**
 * Helper utility functions for formatting and styling
 */

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getInitials = (name) => {
  if (!name) return 'SB';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'Web Development':
      return 'badge-blue';
    case 'AI / Machine Learning':
      return 'badge-purple';
    case 'App Development':
      return 'badge-green';
    case 'Cybersecurity':
      return 'badge-red';
    case 'IoT':
      return 'badge-amber';
    case 'Data Science':
      return 'badge-purple';
    default:
      return 'badge-gray';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Looking for Team Members':
      return 'badge-green';
    case 'In Progress':
      return 'badge-blue';
    case 'Team Complete':
      return 'badge-gray';
    case 'Pending':
      return 'badge-amber';
    case 'Accepted':
      return 'badge-green';
    case 'Rejected':
      return 'badge-red';
    default:
      return 'badge-gray';
  }
};
