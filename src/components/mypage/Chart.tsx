import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getPosts } from '../../api';
import ReactApexChart from 'react-apexcharts';

interface ChartProps {
  title: string;
  nickName: string;
  sellerUid: string;
  content: string;
  price: number;
  imgURL: string;
  category: string;
  like: [];
  views: number;
  createAt: number;
  profileImg: string;
  tsCount: number;
  commentsCount: number;
}
const Chart = () => {
  const { id } = useParams();
  const { isLoading, data: userPostData } = useQuery<ChartProps[]>(
    ['postData'],
    () => getPosts()
  );
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const chartList = userPostData?.filter((user: any) => {
    return saveUser.uid === user.sellerUid;
  });

  // const buyTradeList = isDoneTradeList?.filter((user: any) => {
  //   return saveUser?.uid === user?.buyerUid;
  // });

  console.log('object,sellerUid', id);
  console.log('object,data', chartList);
  console.log(userPostData?.map((point) => Number(point.views)) as number[]);
  return (
    <div>
      {isLoading ? (
        'Loading Chart...'
      ) : (
        <ReactApexChart
          type="area"
          series={[
            {
              name: 'View',
              data: chartList?.map((point) => Number(point.views)) ?? [],
            },
            {
              name: 'Review',
              data:
                chartList?.map((point) => Number(point.commentsCount)) ?? [],
            },
          ]}
          options={{
            chart: {
              height: 200,
              width: 200,
              toolbar: {
                show: false,
              },
              background: 'transparent',
              animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                  enabled: true,
                  delay: 150,
                },
                dynamicAnimation: {
                  enabled: true,
                  speed: 350,
                },
              },
            },
            grid: {
              borderColor: '#555',
              yaxis: {
                lines: {
                  show: false,
                },
              },
            },
            markers: {
              size: 4,
              colors: ['#FFF'],
              strokeColors: '#00BAEC',
              strokeWidth: 3,
            },
            tooltip: {
              theme: 'dark',
              enabledOnSeries: undefined,
              x: { show: false },
              style: {
                fontSize: '15px',
              },
            },
            stroke: {
              curve: 'smooth',
              width: 4,
            },
            yaxis: {
              show: false,
            },

            dataLabels: {
              enabled: true,
              enabledOnSeries: undefined,
              dropShadow: {
                enabled: false,
                top: 1,
                left: 1,
                blur: 1,
                color: '#000',
                opacity: 0.45,
              },
            },
            xaxis: {
              axisTicks: { show: false },
              labels: {
                show: false,
              },
            },
            legend: {
              show: false,
            },
          }}
        />
      )}
    </div>
  );
};

export default Chart;
