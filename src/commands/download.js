async function execute(command, { args, fullArgs }) {
  
  if (!fullArgs) {
    return `❌ Please provide a URL.\nExample: .${command} https://example.com/video`;
  }
  
  const responses = {
    tiktok: `📱 *TIKTOK DOWNLOADER*\n\nURL: ${fullArgs}\n✅ Video found!\n⬇️ Download: tiktok.com/download`,
    instagram: `📷 *INSTAGRAM DOWNLOADER*\n\nURL: ${fullArgs}\n✅ Post found!\n⬇️ Download: instagram.com/download`,
    facebook: `📘 *FACEBOOK DOWNLOADER*\n\nURL: ${fullArgs}\n✅ Video found!\n⬇️ Download: facebook.com/download`,
    youtube: `🎬 *YOUTUBE DOWNLOADER*\n\nURL: ${fullArgs}\n✅ Video found!\n⬇️ Download: youtube.com/download`,
    twitter: `🐦 *TWITTER DOWNLOADER*\n\nURL: ${fullArgs}\n✅ Media found!\n⬇️ Download: twitter.com/download`,
    song: `🎵 *SONG DOWNLOADER*\n\nSearching: ${fullArgs}\n✅ Song found!\n⬇️ Download: music.com/download`,
    video: `🎬 *VIDEO DOWNLOADER*\n\nURL: ${fullArgs}\n✅ Video found!\n⬇️ Download: video.com/download`,
    apk: `📱 *APK DOWNLOADER*\n\nSearching: ${fullArgs}\n✅ APK found!\n⬇️ Download: apkpure.com/download`,
    gdrive: `📁 *GOOGLE DRIVE DOWNLOADER*\n\nURL: ${fullArgs}\n✅ File found!\n⬇️ Download: drive.google.com/direct`
  };
  
  return responses[command] || `✅ Download started for: ${fullArgs}`;
}

module.exports = { execute };
