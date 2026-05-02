const formatTimestamp = (date) => {
  return new Date(date).toISOString();
};

const generateAvatarUrl = (username) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6c5ce7&color=fff&bold=true&size=128`;
};

module.exports = { formatTimestamp, generateAvatarUrl };
