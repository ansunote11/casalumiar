// Perfumes extraídos dos catálogos FlipHTML5 da Casa Lumiar (masculino: jxnq, feminino: oxao).
// Preços por tamanho exatamente como no catálogo. Estoque inicial é provisório: ajuste no painel.
import type { Product } from '../types'

type PerfumeSeed = Omit<Product, 'price' | 'pix_price' | 'stock' | 'featured' | 'active'>

const perfumes: PerfumeSeed[] = [
  {
    "id": "perfume-alvorada",
    "sku": "PFE-001",
    "name": "Alvorada",
    "description": "Uma fragrância feminina, elegante e atemporal, construída sobre uma abertura luminosa e sofisticada de aldeídos e cítricos. Perfil olfativo: Floral, Aldeídico, Cítrico, Amadeirado, Cremoso.",
    "inspiration": "Chanel Nº 5",
    "notes": [
      "Aldeídos",
      "Néroli",
      "Limão",
      "Jasmim",
      "Rosa",
      "Ylang-Ylang",
      "Sândalo",
      "Vetiver",
      "Baunilha"
    ],
    "pyramid": {
      "top": [
        "Aldeídos",
        "Néroli",
        "Limão"
      ],
      "heart": [
        "Jasmim",
        "Rosa",
        "Ylang-Ylang"
      ],
      "base": [
        "Sândalo",
        "Vetiver",
        "Baunilha"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 164.23,
        "pix_price": 118.57
      },
      {
        "label": "50 mL",
        "price": 119.32,
        "pix_price": 86.48
      },
      {
        "label": "30 mL",
        "price": 101.35,
        "pix_price": 73.65
      }
    ],
    "image_url": "produtos/perfume-alvorada.jpg"
  },
  {
    "id": "perfume-deusa-dourada",
    "sku": "PFE-002",
    "name": "Deusa Dourada",
    "description": "Uma fragrância feminina poderosa e sensual que combina a luminosidade do jasmim com a singularidade de um acorde salgado. Perfil olfativo: Âmbar, Floral, Baunilha, Amadeirado, Salgado.",
    "inspiration": "Olympea, de Paco Rabanne",
    "notes": [
      "Acorde Salgado",
      "Jasmim",
      "Tangerina Verde",
      "Baunilha",
      "Flor de Gengibre",
      "Acordes Florais",
      "Âmbar",
      "Sândalo",
      "Cashmeran"
    ],
    "pyramid": {
      "top": [
        "Acorde Salgado",
        "Jasmim",
        "Tangerina Verde"
      ],
      "heart": [
        "Baunilha",
        "Flor de Gengibre",
        "Acordes Florais"
      ],
      "base": [
        "Âmbar",
        "Sândalo",
        "Cashmeran"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.65,
        "pix_price": 123.15
      },
      {
        "label": "50 mL",
        "price": 122.53,
        "pix_price": 88.78
      },
      {
        "label": "30 mL",
        "price": 103.28,
        "pix_price": 75.03
      }
    ],
    "image_url": "produtos/perfume-deusa-dourada.jpg"
  },
  {
    "id": "perfume-rosa-majestade",
    "sku": "PFE-003",
    "name": "Rosa Majestade",
    "description": "Uma fragrância feminina, sofisticada e envolvente, que revela uma combinação luminosa de frutas, flores e madeiras. Perfil olfativo: Floral, Frutado, Amadeirado, Cremoso.",
    "inspiration": "Delina, de Parfums de Marly",
    "notes": [
      "Lichia",
      "Ruibarbo",
      "Bergamota",
      "Noz-moscada",
      "Rosa Turca",
      "Peônia",
      "Baunilha",
      "Almíscar",
      "Cashmeran",
      "Incenso",
      "Cedro",
      "Vetiver do Haiti"
    ],
    "pyramid": {
      "top": [
        "Lichia",
        "Ruibarbo",
        "Bergamota",
        "Noz-moscada"
      ],
      "heart": [
        "Rosa Turca",
        "Peônia",
        "Baunilha",
        "Almíscar"
      ],
      "base": [
        "Cashmeran",
        "Incenso",
        "Cedro",
        "Vetiver do Haiti"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.65,
        "pix_price": 123.15
      },
      {
        "label": "50 mL",
        "price": 122.53,
        "pix_price": 88.78
      },
      {
        "label": "30 mL",
        "price": 103.28,
        "pix_price": 75.03
      }
    ],
    "image_url": "produtos/perfume-rosa-majestade.jpg"
  },
  {
    "id": "perfume-misterio-oriental",
    "sku": "PFE-004",
    "name": "Mistério Oriental",
    "description": "Uma fragrância delicada, cremosa e envolvente, com uma assinatura macia, sensual e acolhedora. Perfil olfativo: Floral, Gourmand, Frutado, Cremoso, Amadeirado.",
    "inspiration": "Yara, da Lattafa Perfumes",
    "notes": [
      "Orquídea",
      "Heliotrópio",
      "Tangerina",
      "Acorde Gourmand",
      "Frutas Tropicais",
      "Baunilha",
      "Almíscar",
      "Sândalo"
    ],
    "pyramid": {
      "top": [
        "Orquídea",
        "Heliotrópio",
        "Tangerina"
      ],
      "heart": [
        "Acorde Gourmand",
        "Frutas Tropicais"
      ],
      "base": [
        "Baunilha",
        "Almíscar",
        "Sândalo"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.91,
        "pix_price": 123.33
      },
      {
        "label": "50 mL",
        "price": 122.65,
        "pix_price": 88.87
      },
      {
        "label": "30 mL",
        "price": 103.35,
        "pix_price": 75.08
      }
    ],
    "image_url": "produtos/perfume-misterio-oriental.jpg"
  },
  {
    "id": "perfume-imperio-rubi",
    "sku": "PFE-005",
    "name": "Império Rubi",
    "description": "Uma fragrância marcante e envolvente que combina o brilho quente do açafrão e a luminosidade do jasmim com um coração sofisticado de madeira de âmbar. Perfil olfativo: Âmbar, Amadeirado, Especiado, Quente, Envolvente.",
    "inspiration": "Amber Rouge, de Orientica",
    "notes": [
      "Jasmim",
      "Açafrão",
      "Madeira de Âmbar",
      "Âmbar Gris",
      "Cedro",
      "Resina de Abeto"
    ],
    "pyramid": {
      "top": [
        "Jasmim",
        "Açafrão"
      ],
      "heart": [
        "Madeira de Âmbar",
        "Âmbar Gris"
      ],
      "base": [
        "Cedro",
        "Resina de Abeto"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.91,
        "pix_price": 123.33
      },
      {
        "label": "50 mL",
        "price": 122.65,
        "pix_price": 88.87
      },
      {
        "label": "30 mL",
        "price": 103.35,
        "pix_price": 75.08
      }
    ],
    "image_url": "produtos/perfume-imperio-rubi.jpg"
  },
  {
    "id": "perfume-liberdade-dourada",
    "sku": "PFE-006",
    "name": "Liberdade Dourada",
    "description": "Uma fragrância feminina, luminosa e marcante que celebra a liberdade através da combinação sofisticada de lavanda, flores brancas e uma base quente e envolvente. Perfil olfativo: Floral, Aromático, Âmbar.",
    "inspiration": "Libre, de YSL",
    "notes": [
      "Mandarina",
      "Lavanda",
      "Flor de Laranjeira",
      "Jasmim",
      "Baunilha",
      "Almíscar",
      "Cedro",
      "Âmbar"
    ],
    "pyramid": {
      "top": [
        "Mandarina",
        "Lavanda"
      ],
      "heart": [
        "Flor de Laranjeira",
        "Jasmim"
      ],
      "base": [
        "Baunilha",
        "Almíscar",
        "Cedro",
        "Âmbar"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 169.37,
        "pix_price": 122.23
      },
      {
        "label": "50 mL",
        "price": 121.88,
        "pix_price": 88.32
      },
      {
        "label": "30 mL",
        "price": 102.89,
        "pix_price": 74.75
      }
    ],
    "image_url": "produtos/perfume-liberdade-dourada.jpg"
  },
  {
    "id": "perfume-magnifica",
    "sku": "PFE-007",
    "name": "Magnífica",
    "description": "Uma fragrância feminina sofisticada e atemporal que revela uma abertura luminosa e refrescante de laranja, bergamota e limão. Perfil olfativo: Cítrico, Floral, Amadeirado, Almiscarado, Oriental.",
    "inspiration": "Coco Mademoiselle, de Chanel",
    "notes": [
      "Laranja",
      "Bergamota",
      "Limão",
      "Rosa",
      "Jasmim",
      "Ylang-Ylang",
      "Patchouli",
      "Vetiver",
      "Baunilha",
      "Almíscar Branco",
      "Fava Tonka",
      "Opoponax"
    ],
    "pyramid": {
      "top": [
        "Laranja",
        "Bergamota",
        "Limão"
      ],
      "heart": [
        "Rosa",
        "Jasmim",
        "Ylang-Ylang"
      ],
      "base": [
        "Patchouli",
        "Vetiver",
        "Baunilha",
        "Almíscar Branco",
        "Fava Tonka",
        "Opoponax"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.91,
        "pix_price": 123.33
      },
      {
        "label": "50 mL",
        "price": 122.65,
        "pix_price": 88.87
      },
      {
        "label": "30 mL",
        "price": 103.35,
        "pix_price": 75.08
      }
    ],
    "image_url": "produtos/perfume-magnifica.jpg"
  },
  {
    "id": "perfume-tesouro-oriental",
    "sku": "PFE-008",
    "name": "Tesouro Oriental",
    "description": "Uma fragrância oriental sofisticada e opulenta, construída em torno da riqueza envolvente do âmbar. Perfil olfativo: Âmbar, Oriental, Amadeirado, Especiado, Adocicado.",
    "inspiration": "Royal Amber, de Orientica",
    "notes": [
      "Notas Cítricas",
      "Especiarias",
      "Acordes Aromáticos",
      "Âmbar",
      "Notas Florais",
      "Acordes Orientais",
      "Madeiras Preciosas",
      "Baunilha",
      "Almíscar",
      "Acordes Resinosos"
    ],
    "pyramid": {
      "top": [
        "Notas Cítricas",
        "Especiarias",
        "Acordes Aromáticos"
      ],
      "heart": [
        "Âmbar",
        "Notas Florais",
        "Acordes Orientais"
      ],
      "base": [
        "Madeiras Preciosas",
        "Baunilha",
        "Almíscar",
        "Acordes Resinosos"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.91,
        "pix_price": 123.33
      },
      {
        "label": "50 mL",
        "price": 122.65,
        "pix_price": 88.87
      },
      {
        "label": "30 mL",
        "price": 103.35,
        "pix_price": 75.08
      }
    ],
    "image_url": "produtos/perfume-tesouro-oriental.jpg"
  },
  {
    "id": "perfume-veludo-real",
    "sku": "PFE-009",
    "name": "Veludo Real",
    "description": "Uma fragrância feminina, sofisticada e envolvente que une a luminosidade da bergamota e a suavidade da violeta ao toque vibrante da pimenta rosa. Perfil olfativo: Atalcado, Floral, Doce, Almiscarado, Gourmand.",
    "inspiration": "Velvet Gold, de Orientica",
    "notes": [
      "Bergamota",
      "Caramelo",
      "Violeta",
      "Pimenta Rosa",
      "Notas Atalcadas",
      "Rosa",
      "Patchouli",
      "Almíscar",
      "Acorde Animálico",
      "Baunilha"
    ],
    "pyramid": {
      "top": [
        "Bergamota",
        "Caramelo",
        "Violeta",
        "Pimenta Rosa"
      ],
      "heart": [
        "Notas Atalcadas",
        "Rosa",
        "Patchouli"
      ],
      "base": [
        "Almíscar",
        "Acorde Animálico",
        "Baunilha"
      ]
    },
    "category_id": "perfumes-femininos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 164.23,
        "pix_price": 118.57
      },
      {
        "label": "50 mL",
        "price": 119.32,
        "pix_price": 86.48
      },
      {
        "label": "30 mL",
        "price": 101.35,
        "pix_price": 73.65
      }
    ],
    "image_url": "produtos/perfume-veludo-real.jpg"
  },
  {
    "id": "perfume-autenticidade",
    "sku": "PMA-001",
    "name": "Autenticidade",
    "description": "Uma fragrância elegante, limpa e marcante. Masculina, contemporânea e cativante, criada para expressar autenticidade, confiança e liberdade. Perfil olfativo: Amadeirado, Floral, Cítrico, Aromático, Âmbar.",
    "inspiration": "MYSLF, de YSL",
    "notes": [
      "Bergamota",
      "Notas Cítricas",
      "Acordes Frescos",
      "Flor de Laranjeira",
      "Lavanda",
      "Notas Florais",
      "Madeiras Preciosas",
      "Patchouli",
      "Ambrofix"
    ],
    "pyramid": {
      "top": [
        "Bergamota",
        "Notas Cítricas",
        "Acordes Frescos"
      ],
      "heart": [
        "Flor de Laranjeira",
        "Lavanda",
        "Notas Florais"
      ],
      "base": [
        "Madeiras Preciosas",
        "Patchouli",
        "Ambrofix"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 189.32,
        "pix_price": 136.49
      },
      {
        "label": "50 mL",
        "price": 131.86,
        "pix_price": 95.44
      },
      {
        "label": "30 mL",
        "price": 108.88,
        "pix_price": 79.03
      }
    ],
    "image_url": "produtos/perfume-autenticidade.jpg"
  },
  {
    "id": "perfume-azul-selvagem",
    "sku": "PMA-002",
    "name": "Azul Selvagem",
    "description": "Uma fragrância masculina intensa, fresca e sofisticada, criada para transmitir liberdade, força e presença. Perfil olfativo: Cítrico, Aromático, Especiado, Amadeirado, Ambarado.",
    "inspiration": "Sauvage, de Dior",
    "notes": [
      "Bergamota",
      "Pimenta",
      "Notas Cítricas",
      "Lavanda",
      "Gerânio",
      "Pimenta Sichuan",
      "Patchouli",
      "Ambroxan",
      "Cedro",
      "Ládano",
      "Notas Ambaradas"
    ],
    "pyramid": {
      "top": [
        "Bergamota",
        "Pimenta",
        "Notas Cítricas"
      ],
      "heart": [
        "Lavanda",
        "Gerânio",
        "Pimenta Sichuan",
        "Patchouli"
      ],
      "base": [
        "Ambroxan",
        "Cedro",
        "Ládano",
        "Notas Ambaradas"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 183.48,
        "pix_price": 132.32
      },
      {
        "label": "50 mL",
        "price": 128.94,
        "pix_price": 93.36
      },
      {
        "label": "30 mL",
        "price": 107.13,
        "pix_price": 77.78
      }
    ],
    "image_url": "produtos/perfume-azul-selvagem.jpg"
  },
  {
    "id": "perfume-codigo-noturno",
    "sku": "PMA-003",
    "name": "Código Noturno",
    "description": "Uma fragrância masculina intensa, moderna e magnética, criada para transmitir confiança, atitude e presença. Perfil olfativo: Aromático, Especiado, Amadeirado, Âmbar, Doce.",
    "inspiration": "212 VIP Black, de Carolina Herrera",
    "notes": [
      "Absinto",
      "Anis",
      "Funcho",
      "Lavanda",
      "Canela",
      "Notas Aromáticas",
      "Almíscar",
      "Âmbar",
      "Madeiras"
    ],
    "pyramid": {
      "top": [
        "Absinto",
        "Anis",
        "Funcho"
      ],
      "heart": [
        "Lavanda",
        "Canela",
        "Notas Aromáticas"
      ],
      "base": [
        "Almíscar",
        "Âmbar",
        "Madeiras"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 183.48,
        "pix_price": 132.32
      },
      {
        "label": "50 mL",
        "price": 128.94,
        "pix_price": 93.36
      },
      {
        "label": "30 mL",
        "price": 107.13,
        "pix_price": 77.78
      }
    ],
    "image_url": "produtos/perfume-codigo-noturno.jpg"
  },
  {
    "id": "perfume-desejo-urbano",
    "sku": "PMA-004",
    "name": "Desejo Urbano",
    "description": "Uma fragrância masculina sedutora, moderna e cativante, criada para transmitir confiança, atitude e magnetismo. Perfil olfativo: Cítrico, Aromático, Especiado, Amadeirado, Doce.",
    "inspiration": "212 Sexy Men, de Carolina Herrera",
    "notes": [
      "Mandarina",
      "Bergamota",
      "Pimenta Verde",
      "Cardamomo",
      "Gardênia",
      "Madeiras Aromáticas",
      "Baunilha",
      "Sândalo",
      "Musk",
      "Âmbar"
    ],
    "pyramid": {
      "top": [
        "Mandarina",
        "Bergamota",
        "Pimenta Verde"
      ],
      "heart": [
        "Cardamomo",
        "Gardênia",
        "Madeiras Aromáticas"
      ],
      "base": [
        "Baunilha",
        "Sândalo",
        "Musk",
        "Âmbar"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.65,
        "pix_price": 123.15
      },
      {
        "label": "50 mL",
        "price": 122.53,
        "pix_price": 88.78
      },
      {
        "label": "30 mL",
        "price": 103.28,
        "pix_price": 75.03
      }
    ],
    "image_url": "produtos/perfume-desejo-urbano.jpg"
  },
  {
    "id": "perfume-dominio",
    "sku": "PMA-005",
    "name": "Domínio",
    "description": "Uma fragrância masculina elegante, intensa e contemporânea, criada para transmitir confiança, presença e liberdade. Perfil olfativo: Cítrico, Aromático, Amadeirado, Especiado, Ambarado.",
    "inspiration": "Bleu de Chanel",
    "notes": [
      "Limão",
      "Grapefruit",
      "Hortelã",
      "Gengibre",
      "Noz-moscada",
      "Jasmim",
      "Cedro",
      "Sândalo",
      "Incenso",
      "Âmbar"
    ],
    "pyramid": {
      "top": [
        "Limão",
        "Grapefruit",
        "Hortelã"
      ],
      "heart": [
        "Gengibre",
        "Noz-moscada",
        "Jasmim"
      ],
      "base": [
        "Cedro",
        "Sândalo",
        "Incenso",
        "Âmbar"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 183.48,
        "pix_price": 132.32
      },
      {
        "label": "50 mL",
        "price": 128.94,
        "pix_price": 93.36
      },
      {
        "label": "30 mL",
        "price": 107.13,
        "pix_price": 77.78
      }
    ],
    "image_url": "produtos/perfume-dominio.jpg"
  },
  {
    "id": "perfume-heranca-oriental",
    "sku": "PMA-006",
    "name": "Herança Oriental",
    "description": "Uma fragrância oriental envolvente e sofisticada, marcada pela riqueza dos acordes árabes e uma aura de mistério e elegância. Perfil olfativo: Oriental, Ambarado, Amadeirado, Especiado, Doce.",
    "inspiration": "Attar Al Wesal",
    "notes": [
      "Notas Aromáticas",
      "Especiarias",
      "Acordes Cítricos",
      "Notas Florais",
      "Âmbar",
      "Acordes Orientais",
      "Madeiras Preciosas",
      "Musk",
      "Acordes Doces"
    ],
    "pyramid": {
      "top": [
        "Notas Aromáticas",
        "Especiarias",
        "Acordes Cítricos"
      ],
      "heart": [
        "Notas Florais",
        "Âmbar",
        "Acordes Orientais"
      ],
      "base": [
        "Madeiras Preciosas",
        "Musk",
        "Acordes Doces"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 144.98,
        "pix_price": 104.82
      },
      {
        "label": "50 mL",
        "price": 109.69,
        "pix_price": 79.61
      },
      {
        "label": "30 mL",
        "price": 95.58,
        "pix_price": 69.53
      }
    ],
    "image_url": "produtos/perfume-heranca-oriental.jpg"
  },
  {
    "id": "perfume-imperio-noturno",
    "sku": "PMA-007",
    "name": "Império Noturno",
    "description": "Uma fragrância masculina elegante, marcante e envolvente, criada para transmitir confiança, poder e sofisticação. Perfil olfativo: Aromático, Amadeirado, Floral, Especiado, Âmbar.",
    "inspiration": "Fakhar Black, da Lattafa Perfumes",
    "notes": [
      "Maçã",
      "Gengibre",
      "Bergamota",
      "Lavanda",
      "Gerânio",
      "Notas Florais",
      "Fava Tonka",
      "Cedro",
      "Âmbar"
    ],
    "pyramid": {
      "top": [
        "Maçã",
        "Gengibre",
        "Bergamota"
      ],
      "heart": [
        "Lavanda",
        "Gerânio",
        "Notas Florais"
      ],
      "base": [
        "Fava Tonka",
        "Cedro",
        "Âmbar"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.91,
        "pix_price": 123.33
      },
      {
        "label": "50 mL",
        "price": 122.65,
        "pix_price": 88.87
      },
      {
        "label": "30 mL",
        "price": 103.35,
        "pix_price": 75.08
      }
    ],
    "image_url": "produtos/perfume-imperio-noturno.jpg"
  },
  {
    "id": "perfume-legado-supremo",
    "sku": "PMA-008",
    "name": "Legado Supremo",
    "description": "Uma fragrância masculina sofisticada e poderosa, criada para transmitir força, sucesso e presença. Perfil olfativo: Frutado, Cítrico, Amadeirado, Aromático, Âmbar.",
    "inspiration": "Aventus, da Creed",
    "notes": [
      "Abacaxi",
      "Bergamota",
      "Maçã",
      "Jasmim",
      "Rosa",
      "Bétula",
      "Almíscar",
      "Musgo de Carvalho",
      "Âmbar",
      "Baunilha"
    ],
    "pyramid": {
      "top": [
        "Abacaxi",
        "Bergamota",
        "Maçã"
      ],
      "heart": [
        "Jasmim",
        "Rosa",
        "Bétula"
      ],
      "base": [
        "Almíscar",
        "Musgo de Carvalho",
        "Âmbar",
        "Baunilha"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 190.43,
        "pix_price": 137.28
      },
      {
        "label": "50 mL",
        "price": 132.41,
        "pix_price": 95.84
      },
      {
        "label": "30 mL",
        "price": 109.21,
        "pix_price": 79.26
      }
    ],
    "image_url": "produtos/perfume-legado-supremo.jpg"
  },
  {
    "id": "perfume-magnata",
    "sku": "PMA-009",
    "name": "Magnata",
    "description": "O homem Magnata não apenas entra em um ambiente, ele o comanda. Uma fragrância que evoca presença inigualável e confiança inabalável. Perfil olfativo: Amadeirado, Aromático, Cítrico, Especiado, Cremoso.",
    "inspiration": "One Million Royal, de Rabanne",
    "notes": [
      "Lavanda",
      "Mandarina",
      "Cardamomo",
      "Sálvia",
      "Cedro",
      "Floral",
      "Benjoim",
      "Madeiras",
      "Cremoso"
    ],
    "pyramid": {
      "top": [
        "Lavanda",
        "Mandarina",
        "Cardamomo"
      ],
      "heart": [
        "Sálvia",
        "Cedro",
        "Floral"
      ],
      "base": [
        "Benjoim",
        "Madeiras",
        "Cremoso"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 149.9,
        "pix_price": null
      },
      {
        "label": "50 mL",
        "price": 109.9,
        "pix_price": null
      },
      {
        "label": "30 mL",
        "price": 79.9,
        "pix_price": null
      }
    ],
    "image_url": "produtos/perfume-magnata.jpg"
  },
  {
    "id": "perfume-sultao-intenso",
    "sku": "PMA-010",
    "name": "Sultão Intenso",
    "description": "Uma fragrância intensa, poderosa e marcante, criada para transmitir força, confiança e presença. Perfil olfativo: Amadeirado, Picante, Âmbar, Aromático, Doce.",
    "inspiration": "Asad, da Lattafa Perfumes",
    "notes": [
      "Pimenta Preta",
      "Abacaxi",
      "Tabaco",
      "Café",
      "Íris",
      "Patchouli",
      "Baunilha",
      "Âmbar",
      "Madeiras Secas"
    ],
    "pyramid": {
      "top": [
        "Pimenta Preta",
        "Abacaxi",
        "Tabaco"
      ],
      "heart": [
        "Café",
        "Íris",
        "Patchouli"
      ],
      "base": [
        "Baunilha",
        "Âmbar",
        "Madeiras Secas"
      ]
    },
    "category_id": "perfumes-masculinos",
    "sizes": [
      {
        "label": "100 mL",
        "price": 170.91,
        "pix_price": 123.33
      },
      {
        "label": "50 mL",
        "price": 122.65,
        "pix_price": 88.87
      },
      {
        "label": "30 mL",
        "price": 103.35,
        "pix_price": 75.08
      }
    ],
    "image_url": "produtos/perfume-sultao-intenso.jpg"
  }
]

export const seedPerfumes: Product[] = perfumes.map((p) => {
  const cheapest = p.sizes.reduce((a, b) => (b.price < a.price ? b : a))
  return { ...p, price: cheapest.price, pix_price: cheapest.pix_price, stock: 10, featured: false, active: true }
})
