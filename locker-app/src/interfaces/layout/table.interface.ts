import type React from 'react';

export interface TableState {
  selectedRowKeys: React.Key[];
  selectedRecord: Array<any>;
}
