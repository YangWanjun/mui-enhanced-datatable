import random
from faker import Faker


fake = Faker('ja_JP')


def main():
    for i in range(1, 45):
        row = {
            "pk": i,
            "name": fake.name(),
            "dept": random.choice([1, 11, 101, 102, 102, 12, 121, 122, 123, 13, 131, 2, 21, 201, 202, 202, 22, 221, 222, 223, 23, 231]),
            "address": fake.address(),
            "salary": random.randrange(400000, 800000, step=10000),
            "retired": 1 if i % 5 == 0 else 0,
        }
        print('  {},'.format(row))


if __name__ == '__main__':
    main()
