'use client';

import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  delivered: { label: 'Delivered', color: 'success' },
  refunded: { label: 'Refunded', color: 'error' },
} as const;

export interface Order {
  shippingForm: { firstName: string; lastName: string; date: Date };
  status: 'pending' | 'delivered' | 'refunded';
}

export interface LatestOrdersProps {
  sx?: SxProps;
  title?: string;
  autoset?: SxProps;
}

export function LatestOrders({ sx, title, autoset }: LatestOrdersProps): React.JSX.Element {
  const [orderdata, setOrderdata] = React.useState<Order[]>();

  React.useEffect(() => {
    const submitOrder = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/checkout');
        const data = await res.json();

        let updatedata = [...data.orders];
        updatedata[0].status = 'delivered';

        setOrderdata(updatedata);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    submitOrder();
  }, []);
  return (
    <Card sx={sx}>
      <CardHeader title="Latest orders" />
      <Divider />
      <Box sx={autoset}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderdata?.map((order, i) => {
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={i}>
                  <TableCell>ORD-00{1 + i}</TableCell>
                  <TableCell>{`${order.shippingForm.firstName} ${order.shippingForm.lastName}`}</TableCell>
                  <TableCell>{dayjs(order.shippingForm.date).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={title ? <ArrowRightIcon fontSize="var(--icon-fontSize-md)" /> : ''}
          size="small"
          variant="text"
        >
          <Link href={'/dashboard/latestorders'}>{title}</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
