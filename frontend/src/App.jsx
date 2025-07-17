/* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000";

const FontGroupManager = () => {
  const [fonts, setFonts] = useState([]);
  const [fontGroups, setFontGroups] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [groupName, setGroupName] = useState("");
  const [fontRows, setFontRows] = useState([""]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editFontRows, setEditFontRows] = useState([]);

  useEffect(() => {
    loadFonts();
    loadFontGroups();
  }, []);

  useEffect(() => {
    fonts.forEach((font) => {
      if (!document.getElementById(`font-style-${font._id || font.id}`)) {
        const style = document.createElement("style");
        style.id = `font-style-${font._id || font.id}`;
        style.textContent = `
          @font-face {
            font-family: '${font.name}';
            src: url('${BASE_URL}${font.path || font.url || ""}');
          }
        `;
        document.head.appendChild(style);
      }
    });
  }, [fonts]);

  // Load fonts from API
  const loadFonts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/fonts`);
      if (!res.ok) throw new Error("Failed to load fonts");
      const json = await res.json();
      const fontsData = json.data || [];
      setFonts(fontsData);
    } catch (error) {
      console.error(error);
      alert("Failed to load fonts");
    }
  };

  // Load font groups from API
  const loadFontGroups = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/font-groups`);
      if (!res.ok) throw new Error("Failed to load font groups");
      const json = await res.json();
      const groupsData = json.data || [];
      setFontGroups(groupsData);
    } catch (error) {
      console.error(error);
      alert("Failed to load font groups");
    }
  };

  // Upload new font
  const handleFontUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus("Uploading...");

    const formData = new FormData();
    formData.append("font", file);

    try {
      const res = await fetch(`${BASE_URL}/api/fonts`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      const newFont = json.data;
      setFonts((prev) => [...prev, newFont]);
      setUploadStatus("Upload successful!");
      e.target.value = "";
    } catch (err) {
      console.error(err);
      setUploadStatus(err.message);
    }
  };

  // Add new font row for group creation
  const handleAddFontRow = () => setFontRows([...fontRows, ""]);

  // Change selected font in font row
  const handleFontSelectChange = (index, value) => {
    const updatedRows = [...fontRows];
    updatedRows[index] = value;
    setFontRows(updatedRows);
  };

  // Remove a font row
  const handleRemoveFontRow = (index) => {
    const updatedRows = fontRows.filter((_, i) => i !== index);
    setFontRows(updatedRows);
  };

  // Create a new font group
  const handleCreateFontGroup = async (e) => {
    e.preventDefault();
    const selectedFonts = fontRows.filter((id) => id);
    if (selectedFonts.length < 2) return alert("Select at least 2 fonts");

    try {
      const res = await fetch(`${BASE_URL}/api/font-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName, fonts: selectedFonts }),
      });
      if (!res.ok) throw new Error("Failed to create group");
      const json = await res.json();
      const newGroup = json.data;
      setFontGroups((prev) => [...prev, newGroup]);
      setGroupName("");
      setFontRows([""]);
    } catch (error) {
      alert("Failed to create font group");
    }
  };

  // Delete a font group
  const handleDeleteGroup = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/font-groups/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setFontGroups(fontGroups.filter((g) => g._id !== id && g.id !== id));
    } catch {
      alert("Failed to delete group");
    }
  };

  // Open edit modal and populate fields
  const openEditModal = (group) => {
    setEditGroupId(group._id || group.id);
    setEditGroupName(group.name);
    setEditFontRows([...group.fonts]);
    setEditModalOpen(true);
  };

  // Change font selection in edit modal
  const handleEditFontChange = (index, value) => {
    const updated = [...editFontRows];
    updated[index] = value;
    setEditFontRows(updated);
  };

  // Update font group
  const handleUpdateFontGroup = async (e) => {
    e.preventDefault();
    const selectedFonts = editFontRows.filter((id) => id);
    if (selectedFonts.length < 2) return alert("Select at least 2 fonts");

    try {
      const res = await fetch(`${BASE_URL}/api/font-groups/${editGroupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editGroupName, fonts: selectedFonts }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const updated = json.data;
      setFontGroups((prev) =>
        prev.map((g) =>
          g._id === updated._id || g.id === updated.id ? updated : g
        )
      );
      setEditModalOpen(false);
    } catch {
      alert("Failed to update group");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-center border-b-2 pb-2">
        <span className="text-amber-800">Font Group</span> Management System
      </h1>

      {/* Upload */}
      <section className="bg-white p-6 rounded shadow cursor-pointer">
        <h2 className="text-xl font-semibold mb-5">Upload Font</h2>
        <input type="file" accept=".ttf" onChange={handleFontUpload} />
        <p className="text-sm mt-2">{uploadStatus}</p>
      </section>

      {/* Fonts */}
      <section className="bg-white p-2 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Available Fonts</h2>
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Preview</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr
                key={font._id || font.id}
                className="bg-white shadow-sm rounded hover:bg-gray-50"
              >
                <td className="px-4 py-3">{font.name}</td>
                <td className="px-4 py-3" style={{ fontFamily: font.name }}>
                  Example Style
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Create Group */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create Font Group</h2>
        <form onSubmit={handleCreateFontGroup}>
          <input
            className="border rounded px-3 py-2 mb-4 w-full"
            type="text"
            required
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          {fontRows.map((val, i) => (
            <div className="flex space-x-4 mb-2" key={i}>
              <select
                className="border rounded px-3 py-2 flex-1"
                value={val}
                onChange={(e) => handleFontSelectChange(i, e.target.value)}
              >
                <option value="">Select Font</option>
                {fonts.map((font) => (
                  <option key={font._id || font.id} value={font._id || font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
              {fontRows.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFontRow(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFontRow}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >
            Add Font
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded ml-4 cursor-pointer hover:bg-green-600"
          >
            Create Group
          </button>
        </form>
      </section>

      {/* Groups */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Font Groups</h2>
        <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-y-3">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2">Group Name</th>
              <th className="px-4 py-2">Fonts</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fontGroups.map((group) => (
              <tr
                key={group._id || group.id}
                className="bg-white shadow rounded"
              >
                <td className="px-4 py-3">{group.name}</td>
                <td className="px-4 py-3">
                  <ul>
                    {group.fonts.map((font) => (
                      <li key={font._id || font.id}>{font.name}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 cursor-pointer hover:bg-yellow-600"
                    onClick={() => openEditModal(group)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600"
                    onClick={() => handleDeleteGroup(group._id || group.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <form onSubmit={handleUpdateFontGroup}>
              <h3 className="text-lg font-semibold mb-4">Edit Font Group</h3>
              <input
                className="border rounded px-3 py-2 mb-4 w-full"
                type="text"
                required
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
              />
              {editFontRows.map((val, i) => (
                <div className="flex space-x-4 mb-2" key={i}>
                  <select
                    className="border rounded px-3 py-2 flex-1"
                    value={val}
                    onChange={(e) => handleEditFontChange(i, e.target.value)}
                  >
                    <option value="">Select Font</option>
                    {fonts.map((font) => (
                      <option
                        key={font._id || font.id}
                        value={font._id || font.id}
                      >
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontGroupManager;
