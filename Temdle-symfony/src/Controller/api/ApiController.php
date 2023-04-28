<?php

namespace App\Controller\api;

use App\Entity\Daily;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

class ApiController extends AbstractController
{

    #[Route('/api/getDaily', name: 'app_api', methods: ["GET"])]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $today = new \DateTime();
        $today = $today->format("Y-m-d");
        $getId = $doctrine->getRepository(Daily::class)->findBy(["Date" => $today]);
        $data = [
            "id" => $getId[0]->getId()
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
