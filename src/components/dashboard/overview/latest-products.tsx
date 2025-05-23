'use client';

import React from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/redux/api/productApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';

export interface Product {
  id: string;
  image: string;
  name: string;
  updatedAt: Date;
}

export interface LatestProductsProps {
  sx?: SxProps;
  title?: string;
  autoset?: SxProps;
}

export function LatestProducts({ sx, title, autoset }: LatestProductsProps): React.JSX.Element {
  const { loading, products } = useAppSelector((state) => state.products);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useAppDispatch();

  const fetchProduct = async (): Promise<void> => {
    try {
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  React.useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <Card sx={sx}>
      <CardHeader title="Latest products" />
      <Divider />
      <List sx={autoset}>
        {products?.map((product, index) => (
          <ListItem divider={index < products.length - 1} key={product._id}>
            <ListItemAvatar>
              {product.image ? (
                <Box
                  component="img"
                  src={product.image ? `${API_URL}/uploads/${product.image}` : undefined}
                  sx={{ borderRadius: 1, height: '48px', width: '48px' }}
                />
              ) : (
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'var(--mui-palette-neutral-200)',
                    height: '48px',
                    width: '48px',
                  }}
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={product.title}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={`Updated ${dayjs(product.updatedAt).format('MMM D, YYYY')}`}
              secondaryTypographyProps={{ variant: 'body2' }}
            />
            <IconButton edge="end">
              <DotsThreeVerticalIcon weight="bold" />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={title ? <ArrowRightIcon fontSize="var(--icon-fontSize-md)" /> : ''}
          size="small"
          variant="text"
        >
          <Link href="/dashboard/latestproducts">{title}</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
