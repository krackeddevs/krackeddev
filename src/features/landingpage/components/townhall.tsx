"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BaseGameWorld } from "@/components/game/BaseGameWorld";
import { WhitepaperPdfModal } from "@/components/game/WhitepaperPdfModal";
import {
    MAP_HEIGHT,
    MAP_WIDTH,
    TILE_EMPTY,
    TILE_WALL,
} from "@/lib/game/constants";
import type { BuildingConfig } from "@/lib/game/types";

export function TownhallV2() {
    const router = useRouter();
    const [showWhitepaper, setShowWhitepaper] = useState(false);

    const map = useMemo(() => {
        const newMap: number[][] = [];

        for (let y = 0; y < MAP_HEIGHT; y++) {
            const row: number[] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                // Default: border walls all around (including top)
                const isBorder =
                    x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;
                row.push(isBorder ? TILE_WALL : TILE_EMPTY);
            }
            newMap.push(row);
        }

        return newMap;
    }, []);

    const buildings: BuildingConfig[] = useMemo(() => [], []);

    const savePointA = useMemo(
        () => ({
            x1: 640,
            x2: 780,
            y1: 130,
            y2: 10,
        }),
        []
    );

    const savePointB = useMemo(
        () => ({
            x1: 135,
            x2: 22.5,
            y1: 400,
            y2: 550,
        }),
        []
    );

    const savePointC = useMemo(
        () => ({
            x1: 1665,
            x2: 1777.5,
            y1: 765,
            y2: 900,
        }),
        []
    );

    const savePointD = useMemo(
        () => ({
            x1: 1275,
            x2: 1400,
            y1: 135,
            y2: 240,
        }),
        []
    );

    const savePointE = useMemo(
        () => ({
            x1: 375,
            x2: 500,
            y1: 350,
            y2: 180,
        }),
        []
    );

    return (
        <>
            <BaseGameWorld
                map={map}
                buildings={buildings}
                onBuildingEnter={() => { }}
                backgroundImagePath="/map/townhall.png"
                backgroundFit="cover"
                // showDebugHud
                walkableRectangles={[savePointA, savePointB, savePointC]}
                triggerZones={[
                    {
                        id: "save-point-a",
                        rect: savePointA,
                        modal: {
                            title: "Whitepaper",
                            body: "Read our community goals and vision?",
                            cancelText: "Cancel",
                            confirmText: "Yes",
                        },
                        onConfirm: () => setShowWhitepaper(true),
                        once: false,
                    },
                    {
                        id: "save-point-b",
                        rect: savePointB,
                        modal: {
                            title: "Bounties",
                            body: "Earn rewards for completing coding tasks",
                            cancelText: "Cancel",
                            confirmText: "Yes",
                        },
                        onConfirm: () => router.push("/code/bounty"),
                        once: false,
                    },
                    {
                        id: "save-point-c",
                        rect: savePointC,
                        modal: {
                            title: "Founding members",
                            body: "danial\nadam\nmuhaimin\nsolah\nanep\npali\nirfan\nnatasha\nunies",
                            confirmText: "OK",
                        },
                        once: false,
                    },
                    {
                        id: "save-point-d",
                        rect: savePointD,
                        modal: {
                            title: "Socials",
                            body: "Join our community:",
                            actions: [
                                { label: "Discord", href: "https://discord.gg/XfkHsa8R" },
                                {
                                    label: "X",
                                    href: "https://x.com/i/communities/1983062242292822298",
                                },
                            ],
                        },
                        once: false,
                    },
                    {
                        id: "save-point-e",
                        rect: savePointE,
                        modal: {
                            title: "Jobs",
                            body: "Explore available tech jobs?",
                            cancelText: "Cancel",
                            confirmText: "Yes",
                        },
                        onConfirm: () => router.push("/jobs"),
                        once: false,
                    },
                ]}
            />

            <WhitepaperPdfModal
                open={showWhitepaper}
                onClose={() => setShowWhitepaper(false)}
            />
        </>
    );
}
