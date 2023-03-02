import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../api';
import ReactApexChart from 'react-apexcharts';
import { postType } from '../../types';

const Chart = () => {
  const { isLoading, data: userPostData } = useQuery<postType[]>(
    ['postData'],
    () => getPosts(),
    {
      refetchInterval: 10000,
    }
  );

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const chartList = userPostData?.filter((user: any) => {
    return saveUser.uid === user.sellerUid;
  });

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
              x: { show: true },
              style: {
                fontSize: '15px',
              },
            },
            stroke: {
              curve: 'smooth',
              width: 4,
            },
            yaxis: {
              labels: {
                show: false,
              },
            },

            xaxis: {
              axisTicks: { show: false },
              axisBorder: {
                show: false,
              },
              labels: {
                show: true,
                datetimeFormatter: {
                  month: "mmm 'yy",
                },
              },
              type: 'datetime',
              categories: chartList?.map((date) => date.createAt),
              tooltip: {
                enabled: true,
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
