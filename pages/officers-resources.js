/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db } from "../lib/firebaseClient";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import useAuthRole from "../hooks/useAuthRole";
import { createMarkup } from "../lib/richText";

export default function OfficersResources() {
  const { role, loading: loadingAuth } = useAuthRole();
  const [tabs, setTabs] = useState([]);
  const [active, setActive] = useState(0);
  const [loadingTabs, setLoadingTabs] = useState(true);

  useEffect(() => {
    async function load() {
      setLoadingTabs(true);
      try {
        const q = query(collection(db, "officer_resources"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => {
          const orderA = a.order ?? 9999;
          const orderB = b.order ?? 9999;
          if (orderA !== orderB) return orderA - orderB;
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        setTabs(data);
        setActive(0);
      } catch (e) {
        console.error("load officer resources:", e);
      } finally {
        setLoadingTabs(false);
      }
    }
    load();
  }, []);

  if (loadingAuth)
    return (
      <Layout>
        <div className="p-6 text-center">Checking access...</div>
      </Layout>
    );

  if (!["master", "officer"].includes(role)) {
    return (
      <Layout>
        <div className="p-6 text-center text-gray-700 dark:text-gray-300">
          403 — Access restricted. This section is only available to authorised Medical Officers / Admins.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-qehNavy dark:text-white mb-4">
          Officers Resources
        </h1>

        {loadingTabs && <div className="text-gray-500">Loading resources...</div>}

        {!loadingTabs && tabs.length === 0 && (
          <div className="text-gray-600">No resources published yet.</div>
        )}

        {!loadingTabs && tabs.length > 0 && (
          <div className="mt-4">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActive(i)}
                  className={`px-3 py-2 rounded-md transition ${
                    active === i
                      ? "bg-qehBlue text-white shadow"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>

            {/* Active Tab Content */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {tabs[active].imageUrl && (
                <a
                  href={tabs[active].imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={tabs[active].imageUrl}
                    alt={tabs[active].title}
                    className="w-full h-56 object-cover rounded mb-4 cursor-pointer hover:opacity-90"
                  />
                </a>
              )}

              <h2 className="text-xl font-semibold text-qehNavy dark:text-white mb-3">
                {tabs[active].title}
              </h2>

              <div
                className="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={createMarkup(tabs[active].content, { linkify: true })}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
