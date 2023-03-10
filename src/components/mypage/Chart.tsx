import { useQuery } from '@tanstack/react-query';
import { getOnSalePosts } from '../../api';
import Loader from '../etc/Loader';
import ReactApexChart from 'react-apexcharts';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { CustomModal } from '../modal/CustomModal';
import { viewModalAtom } from '../../atom';
import styled from 'styled-components';

const Chart = () => {
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const { isLoading, data: userPostData } = useQuery(
    ['onSalePosts'],
    getOnSalePosts,
    {
      refetchInterval: 10000,
    }
  );

  //날짜 별 총 내역
  const isDoneTradeList =
    userPostData &&
    userPostData.filter((post: any) => {
      return post.isDone === true;
    });

  // 출금 내역
  const chartBuyerList = isDoneTradeList?.filter((user: any) => {
    return saveUser?.uid === user?.buyerUid;
  });

  //입금 내역
  const chartSellerList = isDoneTradeList?.filter((user: any) => {
    return saveUser?.uid === user?.sellerUid;
  });

  //모달작업
  const [isModalActive, setIsModalActive] = useRecoilState(viewModalAtom);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = isModalActive ? 'hidden' : 'auto';
      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, [isModalActive]);

  return (
    <div>
      {isModalActive ? (
        <CustomModal
          modal={isModalActive}
          setModal={setIsModalActive}
          width="800"
          height="450"
          overflow="scroll"
          element={
            <ChartContainer>
              {isLoading ? (
                <Loader />
              ) : (
                <ReactApexChart
                  type="area"
                  series={[
                    {
                      name: '출금',
                      data:
                        chartBuyerList?.map((point: any) =>
                          Number(point.price)
                        ) ?? [],
                    },
                    {
                      name: '입금',
                      data:
                        chartSellerList?.map((point: any) =>
                          Number(point.price)
                        ) ?? [],
                    },
                  ]}
                  options={{
                    chart: {
                      height: 400,
                      width: 600,
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
                    title: {
                      text: '포인트 입출금 내역 차트',
                      align: 'center',
                      style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#2F3233',
                      },
                    },
                    colors: ['#FF6C2C', '#4270ED'],
                    grid: {
                      yaxis: {
                        lines: {
                          show: false,
                        },
                      },
                    },
                    markers: {
                      size: 4,
                      colors: ['#FFE7DD'],
                      strokeColors: '#FF6C2C',
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
                    dataLabels: {
                      style: {
                        colors: ['#FF6C2C', '#4270ED'],
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
                      categories: isDoneTradeList?.map(
                        (date: any) => date.createdAt
                      ),
                      tooltip: {
                        enabled: true,
                      },
                    },
                    legend: {
                      show: true,
                      labels: {
                        colors: '#2F3233',
                      },
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 90, 100],
                      },
                    },
                  }}
                />
              )}
            </ChartContainer>
          }
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default Chart;

const ChartContainer = styled.div`
  width: 600px;
  height: 400px;
`;
