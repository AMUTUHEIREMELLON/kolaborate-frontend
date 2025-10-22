import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/config";

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/profiles?page=${page}&limit=${limit}`)
      .then((response) => {
        setProfiles(response.data.profiles);
        setTotal(response.data.total);
      })
      .catch((error) => console.error("Error fetching profiles:", error));
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <h2>Profiles</h2>
      <ul>
        {profiles.map((profile) => (
          <li key={profile._id}>
            {profile.name} - {profile.location} - ${profile.hourlyRate}/hr
            <ul>
              {profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>
        {" "}
        Page {page} of {Math.ceil(total / limit)}{" "}
      </span>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === Math.ceil(total / limit)}
      >
        Next
      </button>
    </div>
  );
};

export default ProfileList;
