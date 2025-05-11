"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState([]);

  useEffect(() => {
    const fetchannouncement = async () => {
      try {
        const response = await fetch("/api/postAnnouncement");
        const data = await response.json();

        if (response.ok) {
          setAnnouncement(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchannouncement();
  }, [announcement]);

  return (
    <div class="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
      {announcement.map((post) => (
        <div class="rounded-md pb-2 bg-white shadow-default dark:border-strokedark dark:bg-meta-4">
          <a class="block px-4 py-4" href="#">
            <Image
              className="rounded-sm"
              src={post.image}
              width={432}
              height={238}
            />
          </a>
          <div class="flex items-center gap-3 px-6">
            <div>
              <h4 class="font-medium text-black  dark:text-white">
                {post.announcerName}
              </h4>
              <p class="text-sm">{post.announcementDate}</p>
            </div>
          </div>
          <div class="px-6 py-1 ">
            <h4 class="mb-1 text-xl font-semibold text-black dark:text-white ">
              <p>{post.title}</p>
            </h4>
            <p className=" dark:text-bodydark1 text-left">{post.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Announcement;
