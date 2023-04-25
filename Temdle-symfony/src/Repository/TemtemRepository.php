<?php

namespace App\Repository;

use App\Entity\Temtem;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Temtem>
 *
 * @method Temtem|null find($id, $lockMode = null, $lockVersion = null)
 * @method Temtem|null findOneBy(array $criteria, array $orderBy = null)
 * @method Temtem[]    findAll()
 * @method Temtem[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TemtemRepository extends ServiceEntityRepository
{
    private $doctrine;
    public function __construct(ManagerRegistry $registry)
    {
        $this->doctrine = $registry;
        parent::__construct($registry, Temtem::class);
    }

    public function save(Temtem $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Temtem $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function insert($id, $name)
    {
        $Temtem = new Temtem;
        $Temtem->setId($id)
        ->setName($name); 
        $this->doctrine->getManager()->persist($Temtem);
        $this->doctrine->getManager()->flush();
    }

//    /**
//     * @return Temtem[] Returns an array of Temtem objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Temtem
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
