<template>
  <div>
    <Header />
    <div class="q-ma-xl">
      <div class="page-title">Set List</div>

      <div class="search-filters">
        <q-input dense v-model="searchFilter.setGenericName" filled hint="Search by set name" debounce="900" clearable />
        <q-input dense v-model="searchFilter.setId" filled hint="Search by set no." debounce="900" clearable />
        <q-select
          dense
          filled
          v-model="searchFilter.setDeptCode"
          emit-value
          map-options
          use-input
          input-debounce="900"
          hint="Search by department"
          :options="deptOptions"
          @filter="filterDept"
          borderless
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          dense
          filled
          v-model="searchFilter.setCategoryCode"
          emit-value
          map-options
          use-input
          input-debounce="900"
          hint="Search by category"
          :options="catOptions"
          @filter="filterCat"
          borderless
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          filled
          dense
          v-model="searchFilter.dateFrom"
          type="date"
          hint="Date from"
          clearable
        />
        <q-input
          filled
          dense
          v-model="searchFilter.dateTo"
          type="date"
          hint="Date to"
          clearable
        />
        <q-input dense v-model="searchFilter.receivingReport" filled hint="Search by RR No." debounce="900" clearable />
        <q-select
          dense
          filled
          v-model="searchFilter.condemned"
          emit-value
          map-options
          use-input
          input-debounce="900"
          hint="Search condemned"
          :options="condemnedSelect"
          borderless
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          dense
          filled
          v-model="searchFilter.salvaged"
          emit-value
          map-options
          use-input
          input-debounce="900"
          hint="Search salvaged"
          :options="salvagedSelect"
          borderless
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div>
        <q-table
          class="data-table"
          flat bordered
          title="Sets"
          :rows="itemData"
          :columns="columns"
          row-key="name"
          :loading="loading"
          :rows-per-page-options="[10]"
          separator="cell"
        >
          <template v-slot:top-right>
            <q-btn
              color="positive"
              icon-right="archive"
              label="Export to csv"
              no-caps
              @click="exportTable"
            />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="editSet(props.row.setId)">

              <q-td key="setGenericName" :props="props">
                {{ props.row.setGenericName }}
              </q-td>

              <q-td key="setId" :props="props">
                {{ props.row.setId }}
              </q-td>

              <q-td key="setDeptCode" :props="props">
                {{ props.row.setDeptCode }}
              </q-td>

              <q-td key="setCategoryCode" :props="props">
                {{ props.row.setCategoryCode }}
              </q-td>

              <q-td key="receivingReport" :props="props">
                {{ props.row.receivingReport }}
              </q-td>

              <q-td key="setCost" :props="props">
                ₱ {{ props.row.setCost.toLocaleString('en-US') }}
              </q-td>

              <q-td key="setDateReceived" :props="props">
                {{ format_date(props.row.setDateReceived) }}
              </q-td>

              <q-td key="setSupplierName" :props="props">
                {{ props.row.setSupplierName }}
              </q-td>

              <q-td key="setPurchaseOrderNo" :props="props">
                {{ props.row.setPurchaseOrderNo }}
              </q-td>

              <q-td key="setInvoiceNo" :props="props">
                {{ props.row.setInvoiceNo }}
              </q-td>

              <q-td key="setItemSpecs" :props="props">
                {{ props.row.setItemSpecs }}
              </q-td>

              <q-td key="setRemarks" :props="props">
                {{ props.row.setRemarks }}
              </q-td>

              <q-td key="condemned" :props="props">
                <span v-if="props.row.condemned===true">Condemned</span>
              </q-td>

              <q-td key="salvaged" :props="props">
                <span v-if="props.row.salvaged===true">Salvaged</span>
              </q-td>

            </q-tr>
          </template>
        </q-table>
      </div>

    </div>

    <!-- edit item modal -->
    <q-dialog v-model="editSetModalOpen" >
      <EditSetModal :id=editSetId :departments=deptList :categories=catList v-on:dClose="closeModal" />
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { exportFile } from 'quasar';
import axios from 'axios';
import Header from '../components/Header.vue';
import EditSetModal from 'src/components/EditSetModal.vue';
import setToken from 'src/helpers/setToken';
import moment from 'moment';

export default defineComponent ({
  components: {
    Header,
    EditSetModal,
  },
  data() {
    return {
      columns: [
        {
          name: 'setGenericName',
          required: true,
          label: 'Set Generic Name',
          align: 'left',
          field: 'setGenericName',
          sortable: true
        },
        { name: 'setId', align: 'left', label: 'Set No.', field: 'setId', sortable: true },
        { name: 'setDeptCode', align: 'left', label: 'Department', field: 'setDeptCode', sortable: true },
        { name: 'setCategoryCode', align: 'left', label: 'Category', field: 'setCategoryCode', sortable: true },
        { name: 'receivingReport', align: 'left', label: 'RR No.', field: 'receivingReport', sortable: true },
        { name: 'setCost', align: 'right', label: 'Set Cost', field: 'setCost', sortable: true },
        { name: 'setDateReceived', align: 'left', label: 'Date Received', field: 'setDateReceived', sortable: true },
        { name: 'setSupplierName', align: 'left', label: 'Supplier name', field: 'setSupplierName', sortable: true },
        { name: 'setPurchaseOrderNo', align: 'left', label: 'Purchase Order No.', field: 'setPurchaseOrderNo', sortable: true },
        { name: 'setInvoiceNo', align: 'left', label: 'Invoice No.', field: 'setInvoiceNo', sortable: true },
        { name: 'setItemSpecs', align: 'left', label: 'Specifications', field: 'setItemSpecs', sortable: true },
        { name: 'setRemarks', align: 'left', label: 'Remarks', field: 'setRemarks', sortable: true },
        { name: 'condemned', align: 'left', label: 'Condemned', field: 'condemned', sortable: true },
        { name: 'salvaged', align: 'left', label: 'Salvaged', field: 'salvaged', sortable: true },
      ],
      condemnedSelect: [
        { value: '1', label: 'Condemned' },
        { value: '0', label: 'Not Condemned' },
      ],
      salvagedSelect: [
        { value: '1', label: 'Salvaged' },
        { value: '0', label: 'Not Salvaged' },
      ],
      loading: false,
      url: `${process.env.API_HOST}/api/setlist`,
      deptUrl: `${process.env.API_HOST}/api/getDept`,
      categoryUrl: `${process.env.API_HOST}/api/getCategory`,
      token: setToken().token,
      user: setToken().user,
      rights: setToken().rights,
      itemData: [],
      editSetModalOpen: false,
      editSetId: null,

      deptList: null,
      deptOptions: this.deptList,

      catList: null,
      catOptions: this.catList,

      // search filter variables
      searchFilter: {
        setGenericName: null,
        setId: null,
        setDeptCode: null,
        setCategoryCode: null,
        dateFrom: null,
        dateTo: null,
      },
      searchQuery: '',
    }
  },
  computed: {
    ...mapState([
      'departments',
      'categories',
    ]),
  },
  methods: {
    format_date(value){
      if (value) {
        return moment(String(value)).utcOffset('-0000').format('YYYY-MM-DD');
      }
    },
    closeModal(event) {
      this.editSetModalOpen = event;
    },
    warning(text, color) {
      this.$q.notify(
        {
          color: color,
          textColor: 'white',
          icon: 'warning',
          message: text,
        }
      );
    },
    writeQuery() {
      this.searchQuery = '?';
      const filterObj = Object.entries(this.searchFilter);

      for (const [k, v] of filterObj) {

        if(v != null && v != undefined && v!= '') {
          this.searchQuery += `${k}=${v}&`;
        }
      }
      this.getSets();
    },
    getSets: async function() {
      this.loading = true;
      const getSetUrl = this.url;
      const token = this.token;
      const query = this.searchQuery;

      await axios.get(`${getSetUrl}${query}`, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(res.status === 200 && res.data !== '') {
          this.itemData = res.data
        } else {
          this.warning('Failed to get data', 'red-5');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 900);
      })
    },
    editSet(id) {
      this.editSetModalOpen = true;
      this.editSetId = id;
    },
    wrapCsvValue (val, formatFn, row) {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    },
    exportTable () {
      // naive encoding to csv format
      const content = [this.columns.map(col => this.wrapCsvValue(col.label))].concat(
        this.itemData.map(row => this.columns.map(col => this.wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[ col.field === void 0 ? col.name : col.field ],
          col.format,
          row
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        $q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    filterDept (val, update) {
      if (val === '') {
        update(() => {
          this.deptOptions = this.deptList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.deptOptions = this.deptList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterCat (val, update) {
      if (val === '') {
        update(() => {
          this.catOptions = this.catList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.catOptions = this.catList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
  },
  mounted() {
    this.getSets();
    this.deptList = this.departments;
    this.catList = this.categories;
  },
  watch: {
    departments: function(value) {
      this.deptList = value;
    },
    categories: function(value) {
      this.catList = value;
    },
    searchFilter: {
      handler: function() {
        this.writeQuery();
      },
      deep: true,
    },
  }
})
</script>

<style>
.data-table {
  max-height: 90vh;
  max-width: 100%;
}

.data-table td:first-child{
  background: #F4F4F4;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.data-table tr th {
  position: sticky !important;
  z-index: 2;
  background: #F4F4F4;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.data-table thead tr:first-child th:nth-of-type(2) {
  border-left: none;
}

.data-table thead tr:first-child th {
  border-right: none;
}

.data-table thead tr:first-child th:first-child {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.data-table thead tr:last-child th {
  top: 48px;
  z-index: 3;
}

.data-table tbody td:nth-of-type(2) {
  border-left: none;
}

.data-table thead tr:first-child th {
  top: 0;
  z-index: 1;
}

.data-table tr:first-child th:first-child {
  z-index: 3;
}

.data-table td:first-child {
  z-index: 1;
}

.data-table td:first-child, th:first-child {
  position: sticky;
  left: 0;
}

.data-table tbody {
  scroll-margin-top: 48px
}
</style>
