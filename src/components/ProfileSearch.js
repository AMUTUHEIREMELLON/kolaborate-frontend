import React, { useState } from "react";
import axios from "axios";
import ProfileList from "./ProfileList";
import { API_URL } from "../utils/config";

const ProfileSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    axios
      .get(
        `${API_URL}/api/profiles/search?skills=${encodeURIComponent(
          searchTerm
        )}`
      )
      .then((response) => setSearchResults(response.data))
      .catch((error) => console.error("Error searching profiles:", error));
  };

  return (
    <div>
      <h2>Search Profiles</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter skills (e.g., React)"
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((profile) => (
            <li key={profile._id}>
              {profile.name} - {profile.skills.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileSearch;
