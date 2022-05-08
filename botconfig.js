module.exports = {
  Admins: ["640195766186672148"],
  ExpressServer: true,
  DefaultPrefix: process.env.Prefix,
  Port: 3000,
  SupportServer: "https://discord.gg/dhvJVAPH7H",
  Token: process.env.Token,
  ClientID: process.env.Discord_ClientID,
  ClientSecret: process.env.Discord_ClientSecret,
  Scopes: ["identify", "guilds", "applications.commands"],
  ServerDeafen: true,
  DefaultVolume: 100,
  CallbackURL: "/api/callback",
  "24/7": false,
  CookieSecret: "secretpzz",
  IconURL:
    "https://bot.bomb-bot.ga/logo.gif",
  EmbedColor: "RANDOM",
  Permissions: 277028621632,
  Website: process.env.Website,
  Presence: {
    status: "online", // You can show online, idle, and dnd
    name: "nhạc từ Eden's Land", // The message shown
    type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
  },
  Lavalink: {
    id: "node01.marshalxp.xyz",
    host: "node01.marshalxp.xyz",
    port: 443, // The port that lavalink is listening to. This must be a number!
    pass: "marshal",
    secure: true, 
  },

  Spotify: {
    ClientID: process.env.Spotify_ClientID,
    ClientSecret: process.env.Spotify_ClientSecret,
  },
};
