"use client";

import { apiFetcher } from "@/fetcher";
import useSWR, { mutate } from "swr";
import { use, useState } from "react";
import Button2 from "@/components/buttons/Button2";
import { DeleteIcon, EditIcon } from "@/components/icons";
import ButtonDelete from "@/components/buttons/ButtonDelete";
import { useRouter } from "next/navigation";
import { ContratoGet } from "@/types/residencias/contrato";
import { OcupanteGet } from "@/types/residencias/ocupante";

interface MiContrato {
  contrato: ContratoGet;
  ocupantes: OcupanteGet[];
}

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const contratoUrl = `/api/residencias/contrato/${id}/micontrato/`;
  const deleUrl = `/api/residencias/contrato/${id}/`;

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const shouldFetch = !isDeleting;

  const {
    data: micontrato,
    error,
    isLoading,
  } = useSWR<MiContrato>(shouldFetch ? contratoUrl : null, apiFetcher);
  const contrato = micontrato?.contrato;
  const ocupantes = micontrato?.ocupantes;
  const inquilino = micontrato?.contrato.inquilino_detail;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 text-lg font-medium text-blue-600">
        Cargando detalles del contrato...
      </div>
    );
  }
  if (isDeleting) {
    return (
      <div className="flex justify-center p-8 text-lg font-medium text-blue-600">
        ELIMINANDO UN CONTRATO
      </div>
    );
  }

  if (error || !micontrato) {
    return (
      <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md m-4">
        Error al cargar el Contrato ID: {id}.
      </div>
    );
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Seguro de eliminar el contrato de ${inquilino?.usuario_detail?.persona.nombre}?`
      )
    ) {
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await apiFetcher(deleUrl, { method: "DELETE" });
      router.push("/admin/residencias/contratos/?deleted=true");
    } catch (err: any) {
      setDeleteError(err.message || "Error al eliminar el contrato.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para formatear fechas (simple)
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-xl rounded-lg mt-6">
      {/* HEADER Y ACCIONES */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          Contrato: {inquilino?.usuario_detail?.persona.nombre}{" "}
          {inquilino?.usuario_detail?.persona.apellido}
        </h1>
        <div className="flex space-x-2">
          <Button2
            href={`/admin/residencias/contratos/${contrato?.id}/editar`}
            size="sm"
            variant="update"
          >
            <EditIcon /> Editar
          </Button2>
          <ButtonDelete
            onDelete={handleDelete}
            label={isDeleting ? "Eliminando..." : "Eliminar"}
            icon={<DeleteIcon />}
          />
        </div>
      </div>

      {deleteError && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {deleteError}
        </div>
      )}

      {/* FOTO DE VIVIENDA (Bloque Principal) */}
      <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden mb-4">
        {micontrato?.contrato.vivienda_detail.foto ? (
          <img
            src={micontrato.contrato.vivienda_detail.foto}
            alt={`Vivienda ${micontrato.contrato.vivienda_detail.nro_vivienda}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="absolute inset-0"
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            🏠 No hay foto de vivienda
          </div>
        )}
      </div>

      {/* SECCIÓN 1: DETALLES DEL CONTRATO */}
      <SectionTitle title="Detalles del Contrato" />
      <div className="space-y-2 mb-4 p-3 border rounded-lg bg-blue-50">
        <DetailItem
          label="Nro. Vivienda"
          value={String(contrato?.vivienda_detail.nro_vivienda)}
        />
        <DetailItem
          label="Tipo de Renta"
          value={String(contrato?.tipo_renta)}
        />
        <DetailItem
          label="Expensa"
          value={`${String(contrato?.porcentaje_expensa)}%`}
        />
        <DetailItem label="Descripción" value={String(contrato?.descripcion)} />
      </div>

      {/* SECCIÓN 2: PERÍODO Y FECHAS */}
      <SectionTitle title="Fechas y Plazos" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 border rounded-lg bg-green-50">
          <p className="font-semibold text-sm text-gray-600">Inicio</p>
          <p className="text-lg font-bold text-green-700">
            {formatDate(String(contrato?.fecha_ingreso))}
          </p>
        </div>
        <div className="p-3 border rounded-lg bg-red-50">
          <p className="font-semibold text-sm text-gray-600">Fin</p>
          <p className="text-lg font-bold text-red-700">
            {formatDate(String(contrato?.fecha_ingreso))}
          </p>
        </div>
      </div>

      {/* SECCIÓN 3: INQUILINO */}
      <SectionTitle title="Información del Inquilino" />
      <div className="space-y-2 mb-4 p-3 border rounded-lg">
        <DetailItem label="ID Inquilino" value={String(inquilino?.id)} />
        <DetailItem
          label="Nombre Completo"
          value={
            String(inquilino?.usuario_detail?.persona.nombre) +
            " " +
            String(inquilino?.usuario_detail?.persona.apellido)
          }
          colorClass="font-bold"
        />
        <DetailItem
          label="Email Inquilino"
          value={String(inquilino?.usuario_detail?.email)}
        />
        <DetailItem
          label="CI Inquilino"
          value={String(inquilino?.usuario_detail?.persona.ci)}
        />
        <DetailItem
          label="Telefono Inquilino"
          value={String(inquilino?.usuario_detail?.persona.telefono)}
        />
        <Button2
          href={`/admin/usuarios/usuarios/${inquilino?.id}`}
          size="md"
          variant="show"
        >
          {" "}
          Ver
        </Button2>
      </div>

      {/* SECCIÓN 4: OCUPANTES (Usando el SerializerMethodField) */}
      {micontrato.ocupantes && (
        <>
          <SectionTitle title={`Ocupantes Adicionales `} />
          <div className="space-y-2 mb-4 p-3 border rounded-lg bg-yellow-50">
            {ocupantes?.map((ocupante, index) => (
              <div
                key={ocupante.id || index}
                className="border-b border-yellow-200 last:border-b-0 py-2"
              >
                <p className="font-semibold text-sm text-gray-800 mb-1">
                  Ocupante Nro. {index + 1}
                </p>

                {ocupante.persona ? (
                  <>
                    <DetailItem
                      label="Nombre Completo"
                      value={`${ocupante.persona.nombre || ""} ${
                        ocupante.persona.apellido || ""
                      }`}
                      colorClass="text-gray-700"
                    />
                    <DetailItem
                      label="C.I."
                      value={String(ocupante.persona.ci)}
                    />
                    <Button2
                      href={`/admin/usuarios/otros/${ocupante.persona.id}`}
                      size="sm"
                      variant="show"
                    >
                      {" "}
                      Ver
                    </Button2>
                  </>
                ) : (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Detalles de persona no disponibles.
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- COMPONENTES DE AYUDA SIMPLIFICADOS ---

interface DetailItemProps {
  label: string;
  value: string;
  colorClass?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  colorClass = "text-gray-700",
}) => (
  <div className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-600">{label}:</span>
    <span className={`${colorClass} font-medium`}>{value}</span>
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2 border-b-2 border-gray-200 pb-1">
    {title}
  </h2>
);
