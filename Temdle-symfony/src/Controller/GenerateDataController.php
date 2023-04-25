<?php

namespace App\Controller;

use App\Repository\TemtemRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class GenerateDataController extends AbstractController
{

    public function __construct(private HttpClientInterface $client)
    {
        
    }

    #[Route('/generate/data', name: 'app_generate_data')]
    public function index(TemtemRepository $repository): JsonResponse
    {
        $response = $this->client->request(
            'GET',
            'https://temtem-api.mael.tech/api/temtems'
        );

        $data = json_decode($response->getContent(), true);
        for ($i=0; $i < count($data); $i++) { 
            $repository->insert($data[$i]["number"], $data[$i]["name"]);
        }

        return new JsonResponse("", Response::HTTP_OK);
    }
}
