import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

import timeline1Image from "../../assets/timeline_1.webp?url";
import timeline2Image from "../../assets/timeline_2.webp?url";
import timeline3Image from "../../assets/timeline_3.webp?url";
import timelineFutureImage from "../../assets/timeline_future.webp?url";

function TimelineItem({
  heading,
  description,
  image,
  reverse = undefined,
}: {
  heading: ReactNode;
  description: ReactNode;
  image: string;
  reverse?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_14px_1fr] gap-4">
      <div className={cn("mb-10 flex flex-col gap-2", reverse && "order-last")}>
        <h3
          className={cn(
            "font-noto-sans text-2xl font-extrabold",
            !reverse && "text-right",
          )}
        >
          {heading}
        </h3>
        <p className={`${!reverse && "text-right"}`}>{description}</p>
      </div>

      <div className="bg-secondary-dark"></div>

      <div className={cn("mb-10", reverse && "order-first")}>
        <img
          src={image}
          className="border-primary aspect-260/191 w-full border-6"
        />
      </div>
    </div>
  );
}

export default function ProjectTimeline() {
  return (
    <div className="mx-auto flex max-w-162.5 flex-col gap-1 border-4 border-white bg-black/50 px-5 py-10">
      <div className="flex items-center justify-center">
        <div className="size-5 bg-white"></div>
      </div>

      <TimelineItem
        heading={<>2026/02/15</>}
        description={
          <>
            Persona 3: Iris is born. Established the foundational architecture
            for a hybrid 2D/3D Persona 3 experience on the Nintendo DS.
          </>
        }
        image={timeline1Image}
      />

      <div className="flex items-center justify-center">
        <div className="size-5 bg-white"></div>
      </div>

      <TimelineItem
        reverse
        heading={<>2026/04/27</>}
        description={
          <>
            Milestone Beta is completed. Renamed the project to Persona 3 Dual,
            & publicly revealed the game, marking the transition from a private
            past time to an open-source project.
          </>
        }
        image={timeline2Image}
      />

      <div className="flex items-center justify-center">
        <div className="size-5 bg-white"></div>
      </div>

      <TimelineItem
        heading={<>2026/04/27</>}
        description={
          <>
            Milestone Beta is completed. Renamed the project to Persona 3 Dual,
            & publicly revealed the game, marking the transition from a private
            past time to an open-source project.
          </>
        }
        image={timeline3Image}
      />

      <div className="flex items-center justify-center">
        <div className="size-5 bg-white"></div>
      </div>

      <TimelineItem
        reverse
        heading={<>2026/04/27</>}
        description={
          <>
            Milestone Beta is completed. Renamed the project to Persona 3 Dual,
            & publicly revealed the game, marking the transition from a private
            past time to an open-source project.
          </>
        }
        image={timelineFutureImage}
      />
    </div>
  );
}
