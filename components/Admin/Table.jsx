import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { useState, useMemo, useEffect } from "react";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { keyframes } from "@mui/system";

const Table = ({
  columns,
  rows,
  setSelectedRows,
  handleApproveAll,
  clickableColumns,
}) => {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  
  // Animation for row hover
  const hoverAnimation = keyframes`
    from {
      transform: scale(1);
      box-shadow: none;
    }
    to {
      transform: scale(1.01);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  `;

  // Animation for cell click
  const clickAnimation = keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
    }
  `;

  const theme = createTheme({
    typography: {
      fontFamily: "Satoshi",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: "Satoshi";
            src: url("../../app/fonts/Satoshi-Regular.woff2") format("woff2")
            font-weight: 400;
            font-display: swap;
            font-style: normal;
          }
        `,
      },
    },
  });

  if (!clickableColumns) {
    clickableColumns = [-1];
  }

  const selectedRowsData = useMemo(
    () => rows.filter((row) => rowSelectionModel.includes(row._id)),
    [rowSelectionModel, rows]
  );

  useEffect(() => {
    setSelectedRows(selectedRowsData);
  }, [selectedRowsData, setSelectedRows]);

  const handleClick = (params) => {
    const imageData = params.row.attachedFile;
    const newWindow = window.open();
    newWindow.document.write(`<img src="${imageData}" />`);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        style={{ height: 520, width: "100%" }}
        sx={{
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            color: "#5e35b1",
            backgroundColor: "#027dff",
          },
          "& .MuiCheckbox-root": {
            color: "#000000",
          },
          // Add hover animation to rows
          "& .MuiDataGrid-row": {
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              animation: `${hoverAnimation} 0.3s ease forwards`,
            },
          },
          // Add click animation to cells
          "& .MuiDataGrid-cell": {
            transition: "transform 0.2s ease",
            "&:active": {
              animation: `${clickAnimation} 0.3s ease`,
            },
          },
          // Smooth transitions for toolbar buttons
          "& .MuiButton-root": {
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          },
          // Smooth transitions for pagination
          "& .MuiTablePagination-root": {
            transition: "all 0.3s ease",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns.map((column, index) => ({
            ...column,
            renderCell: (params) => (
              <div
                style={{
                  cursor: clickableColumns.includes(index) ? "pointer" : "auto",
                  paddingLeft: clickableColumns.includes(index)
                    ? "20px"
                    : "0px",
                  transition: "all 0.2s ease",
                }}
                onClick={() => handleClick(params, params.id)}
              >
                {clickableColumns.includes(index) && params.value ? (
                  <OpenInNewIcon 
                    sx={{
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "rotate(45deg) scale(1.2)",
                      }
                    }}
                  />
                ) : (
                  params.value
                )}
              </div>
            ),
          }))}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          className="dark:bg-gray-800 dark:text-gray"
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
          rowSelectionModel={rowSelectionModel}
          sx={{ 
            fontFamily: "Satoshi", 
            fontSize: "15px", 
            color: "#000000",
            // Add transition for sorting/filtering changes
            "& .MuiDataGrid-virtualScroller": {
              transition: "all 0.3s ease",
            },
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Table;