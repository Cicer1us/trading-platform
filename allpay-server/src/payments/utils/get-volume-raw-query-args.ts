import { TransactionsVolumeDto } from '../dto/transactions-volume.dto';

export const getVolumeRawQueryArgs = (
  merchantId: string,
  query: TransactionsVolumeDto,
) => {
  return {
    pipeline: [
      {
        $match: {
          merchantId: { $oid: merchantId },
          $expr: {
            $and: [
              {
                $gte: [
                  '$updatedAt',
                  {
                    $dateFromString: {
                      dateString: query.fromDate ?? null,
                    },
                  },
                ],
              },
              {
                $lt: [
                  '$updatedAt',
                  {
                    $dateFromString: {
                      dateString: query.toDate,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'Transaction',
          localField: '_id',
          foreignField: 'paymentId',
          as: 'transaction',
        },
      },
      { $unwind: { path: '$transaction' } },
      {
        $group: {
          _id: 'payOutAmount',
          total: { $sum: '$transaction.payOutHumanAmount' },
        },
      },
    ],
  };
};
