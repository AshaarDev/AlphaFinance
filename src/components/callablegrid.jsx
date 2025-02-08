// AgGridComponent.js
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
import './compcss/grid.css'

const GridComponent = ({ rowData, columnDefs }) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: '700px',
        width: '800px',
      }}
    >
      <AgGridReact
        rowData={rowData} 
        columnDefs={columnDefs} 
        onGridReady={onGridReady}
        pagination={false} 
        defaultColDef={{
          sortable: true, 
          filter: true, 
          resizable: true, 
        }}
      />
    </div>
  );
};

export default GridComponent;
