import type { ParentItem, Item } from '../../types';
import Table from '../common/Table';

interface ParentItemsTableProps {
  parentItems: ParentItem[];
}

const columns = [
  {
    header: 'Parent Item',
    accessor: 'name',
  },
  {
    header: 'Items',
    accessor: 'items',
    render: (parentItem: ParentItem) => (
      <ul>
        {parentItem.items.map((item: Item) => (
          <li key={item.id}>
            {item.name} ({item.sku})
          </li>
        ))}
      </ul>
    ),
  },
];

const ParentItemsTable = ({ parentItems }: ParentItemsTableProps) => (
  <Table
    columns={columns}
    data={parentItems}
    tableAriaLabel="Parent Items Table"
  />
);

export default ParentItemsTable;
