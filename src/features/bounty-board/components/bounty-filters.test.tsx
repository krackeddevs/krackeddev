import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BountyFilters } from "./bounty-filters";
import type { BountyFilters as BountyFiltersType } from "../types";

const defaultFilters: BountyFiltersType = {
    search: "",
    status: "all",
    difficulty: "all",
    tags: [],
};

describe("BountyFilters", () => {
    it("renders search input", () => {
        const onFiltersChange = vi.fn();
        render(
            <BountyFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />
        );

        expect(screen.getByTestId("search-input")).toBeDefined();
    });

    it("updates search filter on input change", () => {
        const onFiltersChange = vi.fn();
        render(
            <BountyFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />
        );

        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "test query" } });

        expect(onFiltersChange).toHaveBeenCalledWith({
            ...defaultFilters,
            search: "test query",
        });
    });

    it("renders status dropdown", () => {
        const onFiltersChange = vi.fn();
        render(
            <BountyFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />
        );

        expect(screen.getByTestId("status-filter")).toBeDefined();
    });

    it("updates status filter on selection", () => {
        const onFiltersChange = vi.fn();
        render(
            <BountyFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />
        );

        const statusDropdown = screen.getByTestId("status-filter");
        fireEvent.change(statusDropdown, { target: { value: "active" } });

        expect(onFiltersChange).toHaveBeenCalledWith({
            ...defaultFilters,
            status: "active",
        });
    });

    it("renders difficulty dropdown", () => {
        const onFiltersChange = vi.fn();
        render(
            <BountyFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />
        );

        expect(screen.getByTestId("difficulty-filter")).toBeDefined();
    });

    it("updates difficulty filter on selection", () => {
        const onFiltersChange = vi.fn();
        render(
            <BountyFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />
        );

        const difficultyDropdown = screen.getByTestId("difficulty-filter");
        fireEvent.change(difficultyDropdown, { target: { value: "advanced" } });

        expect(onFiltersChange).toHaveBeenCalledWith({
            ...defaultFilters,
            difficulty: "advanced",
        });
    });

    it("shows clear filters button when filters are active", () => {
        const onFiltersChange = vi.fn();
        const activeFilters: BountyFiltersType = {
            search: "test",
            status: "all",
            difficulty: "all",
            tags: [],
        };

        render(
            <BountyFilters filters={activeFilters} onFiltersChange={onFiltersChange} />
        );

        expect(screen.getByTestId("clear-filters-button")).toBeDefined();
    });

    it("clears all filters when clear button is clicked", () => {
        const onFiltersChange = vi.fn();
        const activeFilters: BountyFiltersType = {
            search: "test",
            status: "active",
            difficulty: "advanced",
            tags: ["react"],
        };

        render(
            <BountyFilters filters={activeFilters} onFiltersChange={onFiltersChange} />
        );

        fireEvent.click(screen.getByTestId("clear-filters-button"));

        expect(onFiltersChange).toHaveBeenCalledWith({
            search: "",
            status: "all",
            difficulty: "all",
            tags: [],
        });
    });
});
