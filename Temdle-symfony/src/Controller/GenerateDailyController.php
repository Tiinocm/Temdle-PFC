<?php

namespace App\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Temtem;
use App\Repository\DailyRepository;

class GenerateDailyController extends AbstractController
{
    public $em;
    private $repository;
    public function __construct(EntityManagerInterface $em, DailyRepository $repository)
    {
        $this->em = $em;
        $this->repository = $repository;
    }

    #[Route('/generate/daily', name: 'app_generate_daily')]
    public function index(): Response
    {

        // get the amount of temtem listed in the temtem table
        $maxId = $this->getMaxTemId();
        $maxId = $maxId[0]["maxid"];
        
        $sortedTems = $this->sorted($maxId);
        
        $this->insertDaily($sortedTems);

        return new Response("");
    }


    private function insertDaily($sortedTems)
    {
        $date = new \DateTime();
        $date = date('Y-m-d', strtotime('+1 day', strtotime($date->format("Y-m-d"))));

        for ($i=0; $i < count($sortedTems); $i++) { 
            $this->repository->insert($sortedTems[$i], $date);

            $date = new \DateTime($date);
            $date = date('Y-m-d', strtotime('+1 day', strtotime($date->format("Y-m-d"))));
        }
    }

    private function sorted($maxId) : Array
    {
        $temIds = [];
        for ($i=0; $i < $maxId; $i++) { 
            array_push($temIds, $i + 1);
        }
        shuffle($temIds);
        return $temIds;
        
    }


    private function getMaxTemId()
    {
        $qb = $this->em->createQueryBuilder('t');
        $qb->select('MAX(t.id) AS maxid')
        ->from('App:Temtem', 't');

        $query = $qb->getQuery();
        return $query->getResult();
    }
}
