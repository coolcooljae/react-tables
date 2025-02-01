"use client";

import { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_ColumnFiltersState,
    // type MRT_PaginationState,
    type MRT_SortingState,
} from 'material-react-table';

type GC = {
    data: Array<GolfCourse>;
    meta: {
        totalRowCount: number;
    };
};

type GolfCourse = {
    name: string;
    city: string;
    state: string;
};

const TableWithDataLoading = () => {
    //data and fetching state
    const [data, setData] = useState<GolfCourse[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);

    //table state
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
        [],
    );
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    // const [pagination, setPagination] = useState<MRT_PaginationState>({
    //     pageIndex: 0,
    //     pageSize: 10,
    // });

    // useEffect(() => {
    //     fetch("http://localhost:9876/gc") // Adjust to your API URL
    //         .then((res) => res.json())
    //         // .then((data) => setData(data))
    //         .then((data) => console.log(data))
    //         .catch((err) => console.error("Error fetching data:", err));
    // }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await fetch('http://localhost:9876/gc');
    //         const data = await response.json();
    //         setData(data);
    //         console.log(data);
    //     };
    //
    //     fetchData();
    // }, []);

    // if you want to avoid useEffect, look at the React Query example instead
    useEffect(() => {
        const fetchData = async () => {
            if (!data.length) {
                setIsLoading(true);
            } else {
                setIsRefetching(true);
            }

            try {
                const response = await fetch('http://localhost:9876/gc');
                const json = (await response.json()) as GC;

                setData(json.data);
                setRowCount(json.meta.totalRowCount);
            } catch (error) {
                setIsError(true);
                console.error(error);
                return;
            }
            setIsError(false);
            setIsLoading(false);
            setIsRefetching(false);
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        columnFilters, //re-fetch when column filters change
        globalFilter, //re-fetch when global filter changes
        // pagination.pageIndex, //re-fetch when page index changes
        // pagination.pageSize, //re-fetch when page size changes
        sorting, //re-fetch when sorting changes
    ]);

    const columns = useMemo<MRT_ColumnDef<GolfCourse>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            //column definitions...
            {
                accessorKey: 'city',
                header: 'City',
            },
            {
                accessorKey: 'state',
                header: 'State',
            },
            //end
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowSelection: true,
        getRowId: (row) => row.phoneNumber,
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        // manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        // onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            // pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
        },
    });

    return <MaterialReactTable table={table} />;
};

export default TableWithDataLoading;
