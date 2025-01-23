const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
app.use(bodyParser.json());

// API to fetch group details by group ID
app.get("/api/groups/:id", (req, res) => {
  const groupId = req.params.id;

  // Fetch group and its friends
  db.serialize(() => {
    db.get("SELECT * FROM groups WHERE id = ?", [groupId], (err, group) => {
      if (err || !group) {
        return res.status(404).json({ error: "Group not found" });
      }

      db.all("SELECT * FROM friends WHERE group_id = ?", [groupId], (err, friends) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch friends" });
        }

        res.json({
          group: {
            id: group.id,
            name: group.name,
            friends: friends.map((friend) => ({
              id: friend.id,
              name: friend.name,
            })),
          },
        });
      });
    });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

